import {Contract, ethers} from 'ethers';
import {LeafKeyCoder, LeafValueCoder} from '../';
import {chainAbi} from './abi/chain.abi';
import {IVerifyProofForBlockParams} from './interfaces/VerifyProofForBlockParams.interface';

export class ChainContract {
  private contract: Contract

  constructor(web3Provider: ethers.providers.Provider, chainContractAddress: string) {
    if (!chainContractAddress) {
      throw Error('chainContractAddress is empty');
    }

    this.contract = new ethers.Contract(chainContractAddress, chainAbi, web3Provider);
  }

  async verifyProofForBlock(options: IVerifyProofForBlockParams): Promise<boolean> {
    const result: boolean = await this.contract.verifyProofForBlock(
      options.blockHeight,
      options.proofs,
      LeafKeyCoder.encode(options.key),
      LeafValueCoder.encode(options.value, options.leafType),
    );

    return result;
  }
}
