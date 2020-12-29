export interface IBlock {
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
  votes: Map<string, number>;
  numericFcdKeys: Array<string>;
}
