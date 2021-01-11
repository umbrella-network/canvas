export interface IChainBlock {
  _id: string;
  height: number;
  status: string;
  anchor: number;
  timestamp: Date;
  root: string;
  minter: string;
  staked: number;
  power: number;
  voters: Array<string>;

  /**
   * An object, where keys are addresses, and values are votes.
   */
  votes: { [address: string]: number };

  numericFcdKeys: Array<string>;
}
