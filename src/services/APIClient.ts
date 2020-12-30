import { IAPIClientOptions } from '../models/APIClientOptions';
import axios, { AxiosInstance } from 'axios';
import { IBlock } from '../models/Block';
import { ILeaf } from '../models/Leaf';
import { IProofs } from '../models/Proofs';
import { IKey } from '../models/Key';

export class APIClient {
  private options: IAPIClientOptions;
  private axios: AxiosInstance;

  constructor(options: IAPIClientOptions) {
    this.options = options;
    this.axios = axios.create({
      baseURL: options.baseURL,
    });
  }

  async getBlocks(options?: { offset?: number, limit?: number }): Promise<IBlock[]> {
    const response = await this.axios.get<IBlock[]>('/blocks', {
      params: options
    });

    return response.data;
  }

  async getBlock(blockId: string): Promise<IBlock> {
    const response = await this.axios.get<{data: IBlock}>(`/blocks/${blockId}`);

    return response.data.data;
  }

  async getLeavesOfBlock(blockId: string): Promise<ILeaf[]> {
    const response = await this.axios.get<ILeaf[]>(`/blocks/${blockId}/leaves`); 

    return response.data;
  }

  async getKeys(): Promise<IKey[]> {
    const response = await this.axios.get<{data: IKey[]}>('/keys');
    return response.data.data;
  }

  async getProofs(keys: string[]): Promise<IProofs | null> {
    const response = await this.axios.get<{data: IProofs | Record<string, never>}>('/proofs', {
      params: { keys }
    });

    if(response.data.data.block) {
      return response.data.data as IProofs;
    }

    return null;
  }
}
