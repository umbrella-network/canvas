export interface IBlockLeafWithProof {
  _id: string;
  blockId: number;
  key: string;
  value: string;
  proof: string[];
}
