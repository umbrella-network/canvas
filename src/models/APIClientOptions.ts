import { ChainContract } from '../contracts/Chain';

export interface IAPIClientOptions {
  apiKey: string;

  /**
   * Base url of the API
   */
  baseURL: string;

  /**
   * Chain id
   */
  chainId: string;

  /**
   * Required for `APIClient#verifyProofForBlock(...)`
   */
  chainContract?: ChainContract;
}
