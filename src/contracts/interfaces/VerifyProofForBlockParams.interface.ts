import { LeafType } from '../../';

export interface IVerifyProofForBlockParams {
  blockHeight: number;
  proofs: string[];
  key: string;
  value: string;
  leafType: LeafType;
}
