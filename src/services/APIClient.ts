import { IAPIClientOptions } from '../models/APIClientOptions';
import axios, { AxiosInstance } from 'axios';
import { IChainBlock } from '../models/ChainBlock';
import { IBlockLeafWithProof } from '../models/BlockLeafWithProof';
import { IProofs } from '../models/Proofs';
import { IKeyWithAdditionalInfo } from '../models/KeyWithAdditionalInfo';
import { LeafType } from '../';

export class APIClient {
  private options: IAPIClientOptions;
  private axios: AxiosInstance;

  constructor(options: IAPIClientOptions) {
    this.options = options;
    this.axios = axios.create({
      baseURL: options.baseURL,
    });
  }

  async getBlocks(options?: { offset?: number; limit?: number }): Promise<IChainBlock[]> {
    const response = await this.axios.get<IChainBlock[]>('/blocks', {
      params: options,
    });

    return response.data;
  }

  async getBlock(blockId: string): Promise<IChainBlock> {
    const response = await this.axios.get<{ data: IChainBlock }>(
      `/blocks/${blockId}`
    );

    return response.data.data;
  }

  async getLeavesOfBlock(blockId: string): Promise<IBlockLeafWithProof[]> {
    const response = await this.axios.get<IBlockLeafWithProof[]>(`/blocks/${blockId}/leaves`);

    return response.data;
  }

  async getKeys(): Promise<IKeyWithAdditionalInfo[]> {
    const response = await this.axios.get<{ data: IKeyWithAdditionalInfo[] }>('/keys');
    return response.data.data;
  }

  async getProofs(keys: string[]): Promise<IProofs | null> {
    if(!this.options.apiKey) {
      throw new Error('API key is required for this method');
    }

    const response = await this.axios.get<{
      data: IProofs | Record<string, never>;
    }>('/proofs', {
      headers: {
        'authorization': `Bearer ${this.options.apiKey}`
      },
      params: { keys },
    });

    if (response.data.data.block) {
      return response.data.data as IProofs;
    }

    return null;
  }

  /**
   * Uses verifyProofForBlock method of the Chain contract.
   * @see https://kovan.etherscan.io/address/[contract-address]#readContract
   */
  async verifyProofForNewestBlock(key: string, leafType: LeafType.TYPE_INTEGER | LeafType.TYPE_FLOAT): Promise<{success: boolean, value: number}>

  /**
   * Uses verifyProofForBlock method of the Chain contract.
   * @see https://kovan.etherscan.io/address/[contract-address]#readContract
   */
  async verifyProofForNewestBlock(key: string, leafType: LeafType.TYPE_HEX): Promise<{success: boolean, value: string}>

  async verifyProofForNewestBlock(key: string, leafType: LeafType): Promise<{success: boolean, value: string | number}> {
    if (!this.options.chainContract) {
      throw new Error('chainContract is required');
    }

    const proofs = await this.getProofs([key]);

    if (!proofs) {
      throw new Error('No block found');
    }

    const success = await this.options.chainContract.verifyProofForBlock(
      proofs.block.height,
      proofs.leaves[0].proof,
      key,
      proofs.leaves[0].value,
      leafType,
    );

    return { success, value: this.resolveLeafValue(proofs.leaves[0].value, leafType) };
  }

  private resolveLeafValue(leafValue: string, leafType: LeafType): string | number {
    switch (leafType) {
    case LeafType.TYPE_INTEGER:
      return parseInt(leafValue, 10);
    case LeafType.TYPE_FLOAT:
      return parseFloat(leafValue);
    default:
      return leafValue;
    }
  }
}
