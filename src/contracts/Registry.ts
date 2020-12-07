import {Contract, ethers} from 'ethers';
import {registryAbi} from './abi/registry.abi';

export class Registry {
  private contract: Contract

  constructor(web3Provider: ethers.providers.Provider, registryContractAddress: string) {
    if (!registryContractAddress) {
      throw Error('registryContractAddress is empty');
    }

    this.contract = new ethers.Contract(registryContractAddress, registryAbi, web3Provider);
  }

  getAddress = async (name: string): Promise<string> => this.contract.getAddress(this.strToBytes32(name))

  private strToBytes32 = (str: string): string => {
    const bytes = Buffer.from(str).toString('hex');

    if (bytes.length > 64) {
      throw Error(`name is to long, max supported length is 32 bytes, got: ${bytes.length / 2}`);
    }

    return `0x${bytes}${'0'.repeat(64 - bytes.length)}`;
  };
}
