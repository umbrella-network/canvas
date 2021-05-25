import { IBlock } from './ChainBlock';
import { IBlockLeafWithProof } from './BlockLeafWithProof';

export interface IProofs {
  block: IBlock;
  keys: string[];
  leaves: IBlockLeafWithProof[];
}
