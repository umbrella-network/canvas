import dotenv from 'dotenv';
import { APIClient, LeafType } from '../../src';
import { expect } from 'chai';
import { ethers } from 'ethers';
import { Registry } from '../../src/contracts/Registry';
import { ChainContract } from '../../src/contracts/Chain';
import { expectThrowsAsync } from '../helpers';

dotenv.config();

if (process.env.API_BASE_URL) {
  describe('APIClient()', async () => {
    const apiClient = new APIClient({
      baseURL: process.env.API_BASE_URL as string,
    });

    // These are integration tests that do not require api key
    describe('#getBlocks', () => {
      it('expect to return a valid list of blocks', async () => {
        const blocks = await apiClient.getBlocks();
        expect(blocks).be.an('array');

        blocks.forEach((block) => {
          expect(block).be.an('object');
          expect(block).to.have.property('_id').that.is.a('string');
        });
      });
    });

    describe('#getBlock', () => {
      it('expect to return a valid block', async () => {
        const blocks = await apiClient.getBlocks();
        const blockId = blocks[0]._id;

        const block = await apiClient.getBlock(blockId);

        expect(block).be.an('object');
        expect(block).to.have.property('_id').that.is.a('string');
      });
    });

    describe('#getLeavesOfBlock', () => {
      it('expect to return a valid list of leaves', async () => {
        const blocks = await apiClient.getBlocks();
        const blockId = blocks[0]._id;

        const leaves = await apiClient.getLeavesOfBlock(blockId);
        expect(leaves).be.an('array');

        leaves.forEach((leaf) => {
          expect(leaf).be.an('object');
          expect(leaf).to.have.property('_id').that.is.a('string');
        });
      });
    });

    describe('#getKeys', () => {
      it('expect to return valid keys or an empty array', async () => {
        const keys = await apiClient.getKeys();

        expect(keys).be.an('array');

        keys.forEach((key) => {
          expect(key).be.an('object');
          expect(key).to.have.property('id').that.is.a('string');
        });
      });
    });

    describe('#getProofs', () => {
      it('expect to throw an error when api key is not set', async () => {
        await expectThrowsAsync(async () => await apiClient.getProofs([]), Error, 'API key is required for this method');
      });
    });

    

    if (process.env.API_KEY) {
      
      // Here we'll write integration tests for methods, that use API-key-protected APIs
    } else {
      console.warn(
        'Skipping ClientAPI integration tests requiring API_KEY, as it is not provided.'
      );
    }


    if (
      process.env.API_KEY &&
      process.env.BLOCKCHAIN_PROVIDER_URL &&
      process.env.REGISTRY_CONTRACT_ADDRESS
    ) {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.BLOCKCHAIN_PROVIDER_URL || 'ws://127.0.0.1:8545'
      );
      const registry = new Registry(
        provider,
        process.env.REGISTRY_CONTRACT_ADDRESS as string
      );

      const chainContractAddress = await registry.getAddress('Chain');

      const chainContract = new ChainContract(provider, chainContractAddress);

      const apiClient = new APIClient({
        baseURL: process.env.API_BASE_URL as string,
        apiKey: process.env.API_KEY,
        chainContract,
      });

      describe('#getProofs', () => {
        it('expect to return valid result when api key is set', async () => {
          const keysObjects = await apiClient.getKeys();

          // we will pass all the keys, so we could find some proofs for sure
          const keys = keysObjects.map((keyObject) => keyObject.id);
          const proofs = await apiClient.getProofs(keys);

          expect(proofs).be.an('object');
          expect(proofs).to.have.nested.property('block._id').that.is.a('string');
          expect(proofs).to.have.property('keys').that.is.an('array');
          expect(proofs).to.have.property('leaves').that.is.an('array');
        });
      });

      describe('#verifyProofForBlock', () => {
        it('expect to return valid result', async () => {
          const verificationResult = await apiClient.verifyProofForBlock(
            'eth-usd',
            LeafType.TYPE_INTEGER
          );

          expect(verificationResult).be.an('object');
          expect(verificationResult)
            .to.have.property('success')
            .that.is.a('boolean');
          expect(verificationResult).to.have.property('value');
        });
      });
    } else {
      console.warn('Skipping ClientAPI integration tests requiring BLOCKCHAIN_PROVIDER_URL and REGISTRY_CONTRACT_ADDRESS, as they are not provided.');
    }
  });
} else {
  console.warn('Skipping ClientAPI integration tests as API_BASE_URL not provided.');
}
