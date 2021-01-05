import { IAPIClientOptions } from '../models/APIClientOptions';
import axios, { AxiosInstance } from 'axios';
import { IBlock } from '../models/Block';
import { ILeaf } from '../models/Leaf';
import { IProofs } from '../models/Proofs';
import { IKey } from '../models/Key';
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

  async getBlocks(options?: { offset?: number; limit?: number }): Promise<IBlock[]> {
    const response = await this.axios.get<IBlock[]>('/blocks', {
      params: options,
    });

    return response.data;
  }

  async getBlock(blockId: string): Promise<IBlock> {
    const response = await this.axios.get<{ data: IBlock }>(
      `/blocks/${blockId}`
    );

    return response.data.data;
  }

  async getLeavesOfBlock(blockId: string): Promise<ILeaf[]> {
    const response = await this.axios.get<ILeaf[]>(`/blocks/${blockId}/leaves`);

    return response.data;
  }

  async getKeys(): Promise<IKey[]> {
    const response = await this.axios.get<{ data: IKey[] }>('/keys');
    return response.data.data;
  }

  async getProofs(keys: string[]): Promise<IProofs | null> {
    const response = await this.axios.get<{
      data: IProofs | Record<string, never>;
    }>('/proofs', {
      params: { keys },
    });

    if (response.data.data.block) {
      return response.data.data as IProofs;
    }

    return null;
  }

  /**
   * Uses verifyProofForBlock method of the Chain contract.
   * @see https://kovan.etherscan.io/address/0x459DF121Ab6Cf1B4C99119cc354d7C79c83Ec8bE#readContract
   */
  async verifyProofForBlock<T extends LeafType>(key: string, leafType: T): Promise<{
    success: boolean;
    value: T extends typeof LeafType.TYPE_INTEGER ? number : T extends typeof LeafType.TYPE_FLOAT ? number : string;
  }> {
    if (!this.options.chainContract) {
      throw new Error('chainContract is required');
    }

    const proofs = await this.getProofs([key]);

    if (!proofs) {
      throw new Error('No block found');
    }

    const verified = await this.options.chainContract.verifyProofForBlock({
      blockHeight: proofs.block.height,
      proofs: proofs.leaves[0].proof,
      key,
      value: proofs.leaves[0].value,
      leafType,
    });

    let value: string | number;

    switch (leafType) {
    case LeafType.TYPE_INTEGER:
      value = parseInt(proofs.leaves[0].value, 10);
      break;
    case LeafType.TYPE_FLOAT:
      value = parseFloat(proofs.leaves[0].value);
      break;
    default:
      value = proofs.leaves[0].value;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: verified, value: value as any };
  }
}
