import { Contract, ethers } from 'ethers';

import { DatumCreation } from '../types/DatumCreation';
import { datumRegistryAbi } from './abi';
import { LeafKeyCoder } from '../index';

export class DatumRegistryContract {
  contract: Contract;

  constructor(signerOrProvider: ethers.providers.Provider | ethers.Signer, datumRegistryAddress: string) {
    this.contract = new ethers.Contract(datumRegistryAddress, datumRegistryAbi, signerOrProvider);
  }

  async create(createParams: DatumCreation): Promise<ethers.providers.TransactionResponse> {
    const funderAddress = createParams.funderAddress ?? (await this.contract.signer.getAddress());
    const encodedKeys = this.encodeKeys(createParams.keys);

    const tx = await this.contract.create(
      createParams.receiverAddress,
      funderAddress,
      encodedKeys,
      createParams.depositAmount
    );

    return tx;
  }

  async setDatumEnabled(receiverAddress: string, enabledFlag: boolean): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.setDatumEnabled(receiverAddress, enabledFlag);
    return tx;
  }

  async deposit(receiverAddress: string, depositAmount: string): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.deposit(receiverAddress, depositAmount);
    return tx;
  }

  async withdraw(receiverAddress: string, withdrawAmount?: string): Promise<ethers.providers.TransactionResponse> {
    const amount = withdrawAmount ?? (await this.getBalance(receiverAddress, await this.contract.signer.getAddress()));

    const tx = await this.contract.withdraw(receiverAddress, amount);

    return tx;
  }

  async addKeys(receiverAddress: string, keys: string[]): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.addKeys(receiverAddress, this.encodeKeys(keys));
    return tx;
  }

  async removeKeys(receiverAddress: string, keys: string[]): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.contract.removeKeys(receiverAddress, this.encodeKeys(keys));
    return tx;
  }

  private encodeKeys(keys: string[]): string[] {
    return keys.map((key) => `0x${LeafKeyCoder.encode(key).toString('hex')}`);
  }

  private async getBalance(receiverAddress: string, funderAddress: string): Promise<string> {
    const datumId = await this.contract.resolveId(receiverAddress, funderAddress);
    return (await this.contract.datums(datumId)).balance.toString();
  }
}
