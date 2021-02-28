import { IChainBlock } from './ChainBlock';
import { IBlockLeafWithProof } from './BlockLeafWithProof';

export interface IProofs {
  block: IChainBlock;
  keys: string[];
  leaves: IBlockLeafWithProof[];
}
