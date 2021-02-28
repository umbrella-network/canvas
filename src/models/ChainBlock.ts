import { BigNumber } from 'bignumber.js';

export interface IChainBlock {
  _id: string;
  height: number;
  status: string;
  anchor: BigNumber;
  timestamp: Date;
  root: string;
  minter: string;
  staked: BigNumber;
  power: BigNumber;
  voters: string[];

  /**
   * An object, where keys are addresses, and values are votes.
   */
  votes: { [address: string]: string };

  numericFcdKeys: string[];
}
