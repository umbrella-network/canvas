import { IAPIClientOptions } from '../models/APIClientOptions';
import axios, { AxiosInstance } from 'axios';
import { IChainBlock } from '../models/ChainBlock';
import { IBlockLeafWithProof } from '../models/BlockLeafWithProof';
import { IProofs } from '../models/Proofs';
import { LeafValueCoder } from './LeafValueCoder';
import BigNumber from 'bignumber.js';

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
    const response = await this.axios.get<Record<string, unknown>[]>('/blocks', {
      headers: {
        'authorization': `Bearer ${this.options.apiKey}`,
      },
      params: options,
    });

    return response.data.map(block => this.transformBlock(block));
  }

  async getBlock(blockId: string): Promise<IChainBlock> {
    const response = await this.axios.get<{ data: Record<string, unknown> }>(
      `/blocks/${blockId}`,
      {
        headers: {
          'authorization': `Bearer ${this.options.apiKey}`,
        },
      },
    );

    return this.transformBlock(response.data.data);
  }

  async getNewestBlock(): Promise<IChainBlock> {
    const [newestBlock] = await this.getBlocks({ limit: 1 });

    return newestBlock;
  }

  async getLeavesOfBlock(blockId: string): Promise<IBlockLeafWithProof[]> {
    const response = await this.axios.get<IBlockLeafWithProof[]>(`/blocks/${blockId}/leaves`, {
      headers: {
        'authorization': `Bearer ${this.options.apiKey}`,
      },
    });

    return response.data;
  }

  async getProofs(keys: string[]): Promise<IProofs | null> {
    const response = await this.axios.get('/proofs', {
      headers: {
        'authorization': `Bearer ${this.options.apiKey}`,
      },
      params: { keys },
    });

    if (response.data.data.block) {
      return {
        block: this.transformBlock(response.data.data.block),
        keys: response.data.data.keys,
        leaves: response.data.data.leaves,
      };
    }

    return null;
  }

  /**
   * Uses verifyProofForBlock method of the Chain contract.
   * @see https://kovan.etherscan.io/address/[contract-address]#readContract
   */
  async verifyProofForNewestBlock<T extends string | number = string | number>(key: string): Promise<{success: boolean, value: T}> {
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
    );

    return { success, value: LeafValueCoder.decode(proofs.leaves[0].value) as T };
  }

  private transformBlock(block: Record<string, any>): IChainBlock {
    return {
      ...block,
      anchor: new BigNumber(block.anchor),
      power: new BigNumber(block.power),
      staked: new BigNumber(block.staked),
      timestamp: new Date(block.timestamp),
    } as IChainBlock;
  }
}
