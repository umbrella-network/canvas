import { IBlock } from './Block';
import { ILeaf } from './Leaf';

export interface IProofs {
  block: IBlock;
  keys: string[];
  leaves: ILeaf[];
}
