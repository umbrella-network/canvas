import {Contract, ethers} from 'ethers';
import {LeafKeyCoder} from '../';
import {chainAbi} from './abi';

export class ChainContract {
  private contract: Contract

  constructor(web3Provider: ethers.providers.Provider, chainContractAddress: string) {
    if (!chainContractAddress) {
      throw Error('chainContractAddress is empty');
    }

    this.contract = new ethers.Contract(chainContractAddress, chainAbi, web3Provider);
  }

  async verifyProofForBlock(
    blockId: number,
    proof: string[],
    key: string,
    value: string,
  ): Promise<boolean> {
    const result: boolean = await this.contract.verifyProofForBlock(
      blockId,
      proof,
      LeafKeyCoder.encode(key),
      value,
    );

    return result;
  }
}
