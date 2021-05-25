import { BigNumber } from 'ethers';
import { BlockStatus } from '../types/BlockStatuses';

export interface IBlock {
  _id: string;
  status: BlockStatus;
  chainAddress: string;
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
