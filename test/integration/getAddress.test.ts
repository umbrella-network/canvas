import dotenv from 'dotenv';
import { expect } from 'chai';
import { Registry } from '../../src/contracts/Registry';
import { expectThrowsAsync } from '../helpers';
import { ethers } from 'ethers';

dotenv.config();

const { REGISTRY_CONTRACT_ADDRESS, BLOCKCHAIN_PROVIDER_URL } = process.env;

if (!REGISTRY_CONTRACT_ADDRESS) {
  throw Error('Please setup REGISTRY_CONTRACT_ADDRESS in .env variables');
}

describe('Registry()', () => {
  const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_PROVIDER_URL || 'ws://127.0.0.1:8545');
  const registry = new Registry(provider, REGISTRY_CONTRACT_ADDRESS);

  describe('.getAddress()', () => {
    it('expect to resolve contract address', (done) => {
      registry
        .getAddress('Chain')
        .then((addr) => {
          console.log('Chain address:', addr);
          expect(addr).not.to.eq('0x0000000000000000000000000000000000000000');
          expect(addr.length).to.eq(42);
          done();
        })
        .catch((err) => {
          done(err);
        });
    }).timeout(5000);

    it('expect to throw when name to long', async () => {
      await expectThrowsAsync(
        () => registry.getAddress('a'.repeat(33)),
        Error,
        'name is to long, max supported length is 32 bytes, got: 33'
      );
    });

    it('expect NOT to throw when name is valid length', async () => {
      await registry.getAddress('a'.repeat(32));
      expect(true);
    });
  });
});
