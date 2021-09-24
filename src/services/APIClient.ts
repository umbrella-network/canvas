import { IAPIClientOptions } from '../models/APIClientOptions';
import axios, { AxiosInstance } from 'axios';
import { IBlock } from '../models/ChainBlock';
import { IBlockLeafWithProof } from '../models/BlockLeafWithProof';
import { IProofs } from '../models/Proofs';
import { LeafValueCoder } from './LeafValueCoder';
import { BigNumber } from 'ethers';

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
    const chainId = this.options.chainId;
    const response = await this.axios.get<IBlock[]>('/blocks', {
      headers: {
        authorization: `Bearer ${this.options.apiKey}`,
      },
      params: {
        ...options,
        chainId,
      },
    });

    return APIClient.transformBlocksFromApi(response.data);
  }

  async getBlock(blockId: number): Promise<IBlock> {
    const chainId = this.options.chainId;
    const response = await this.axios.get<{ data: IBlock }>(`/blocks/${blockId}`, {
      headers: {
        authorization: `Bearer ${this.options.apiKey}`,
      },
      params: { chainId },
    });

    return APIClient.transformBlockFromApi(response.data.data);
  }

  async getNewestBlock(): Promise<IBlock> {
    return (await this.getBlocks({ limit: 1 }))[0];
  }

  async getLeavesOfBlock(blockId: number): Promise<IBlockLeafWithProof[]> {
    const chainId = this.options.chainId;
    const response = await this.axios.get<IBlockLeafWithProof[]>(`/blocks/${blockId}/leaves`, {
      headers: {
        authorization: `Bearer ${this.options.apiKey}`,
      },
      params: { chainId },
    });

    return response.data;
  }

  async getProofs(keys: string[]): Promise<IProofs | null> {
    const chainId = this.options.chainId;
    const response = await this.axios.get('/proofs', {
      headers: {
        authorization: `Bearer ${this.options.apiKey}`,
      },
      params: {
        ...keys,
        chainId,
      },
    });

    if (response.data.data.block) {
      return {
        block: APIClient.transformBlockFromApi(response.data.data.block),
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
  async verifyProofForNewestBlock<T extends string | number = string | number>(
    key: string
  ): Promise<{ success: boolean; value: T; dataTimestamp: Date }> {
    if (!this.options.chainContract) {
      throw new Error('chainContract is required');
    }

    const proofs = await this.getProofs([key]);

    if (!proofs || proofs.leaves.length === 0 || !proofs.leaves[0].proof) {
      throw new Error('Proof not found');
    }

    const success = await this.options.chainContract.verifyProofForBlock(
      proofs.block.blockId,
      proofs.leaves[0].proof,
      key,
      proofs.leaves[0].value
    );

    return {
      success,
      value: LeafValueCoder.decode(proofs.leaves[0].value, key) as T,
      dataTimestamp: proofs.block.dataTimestamp,
    };
  }

  static transformBlockFromApi(apiBlockData: IBlock): IBlock {
    return {
      ...apiBlockData,
      anchor: BigNumber.from(apiBlockData.anchor),
      power: BigNumber.from(apiBlockData.power),
      staked: BigNumber.from(apiBlockData.staked),
      dataTimestamp: new Date(apiBlockData.dataTimestamp),
    };
  }

  static transformBlocksFromApi(apiBlocksData: IBlock[]): IBlock[] {
    return apiBlocksData.map(APIClient.transformBlockFromApi);
  }
}

export interface IChainBlock {
  _id: string;
  blockId: number;
  anchor: BigNumber;
  dataTimestamp: Date;
  root: string;
  minter: string;
  staked: BigNumber;
  power: BigNumber;
  voters: string[];

  /**
   * An object, where keys are addresses, and values are votes.
   */
  votes: { [address: string]: string };
}
