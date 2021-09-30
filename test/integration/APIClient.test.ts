import dotenv from 'dotenv';
import { APIClient, ChainContract } from '../../src';
import { expect } from 'chai';
import { ethers } from 'ethers';
import { Registry } from '../../src/contracts/Registry';
import { BlockStatus } from '../../src/types/BlockStatuses';

dotenv.config();

const { REGISTRY_CONTRACT_ADDRESS, BLOCKCHAIN_PROVIDER_URL, API_BASE_URL, API_KEY, CHAIN_ID } = process.env;

describe('APIClient()', async () => {
  const apiClient = new APIClient({
    baseURL: API_BASE_URL as string,
    apiKey: API_KEY as string,
    chainId: CHAIN_ID as string,
  });

  // These are integration tests that do not require api key
  describe('#getBlocks', () => {
    it('expect to return a valid list of blocks', async () => {
      const blocks = await apiClient.getBlocks();

      expect(blocks).be.an('array');
      expect(blocks.length).gt(0);

      blocks.forEach((block) => {
        expect(block).be.an('object');
        expect(block).to.have.property('blockId').that.is.a('number');
        expect(block).to.have.property('root').that.is.a('string');
      });
    });
  });

  describe('#getBlock', () => {
    it('expect to return a valid block', async () => {
      const blocks = await apiClient.getBlocks();
      const blockId = blocks[0].blockId;
      const block = await apiClient.getBlock(blockId);

      console.log(JSON.stringify(block));

      expect(block).be.an('object');
      expect(block).to.have.property('blockId').that.is.a('number');
      expect(block.blockId).to.be.gt(0);
    });
  });

  describe('#getNewestBlock', () => {
    it('expect to return a valid block', async () => {
      const block = await apiClient.getNewestBlock();

      expect(block).be.an('object');
      expect(block).to.have.property('blockId').that.is.a('number');
      expect(block.blockId).to.be.gt(0);
    });
  });

  describe('#getLeavesOfBlock', () => {
    it('expect to return a valid list of leaves', async () => {
      const block = await apiClient.getNewestBlock();
      const blockId = block.status === BlockStatus.Finalized ? block.blockId : block.blockId - 1;
      const leaves = await apiClient.getLeavesOfBlock(blockId);

      //console.log(JSON.stringify(leaves));

      expect(leaves).be.an('array');
      expect(leaves.length).gt(0);

      leaves.forEach((leaf) => {
        expect(leaf).be.an('object');
        expect(leaf).to.have.property('blockId').that.is.a('number');
      });
    });
  });
});

describe('APIClient() with chain settings', () => {
  let chainContractAddress: string;
  let chainContract: ChainContract;
  let apiClient: APIClient;

  before(async () => {
    const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_PROVIDER_URL || 'ws://127.0.0.1:8545');
    const registry = new Registry(provider, REGISTRY_CONTRACT_ADDRESS as string);

    chainContractAddress = await registry.getAddress('Chain');
    chainContract = new ChainContract(provider, chainContractAddress);

    apiClient = new APIClient({
      baseURL: API_BASE_URL as string,
      apiKey: API_KEY as string,
      chainContract,
      chainId: CHAIN_ID as string,
    });
  });

  describe('#getProofs', () => {
    it('expect to return valid result when api key is set', async () => {
      const lastBlock = await apiClient.getNewestBlock();

      console.log(JSON.stringify(lastBlock));

      // if last block is not finalized yet, lets use previous
      const leaves = await apiClient.getLeavesOfBlock(
        lastBlock.status == BlockStatus.Finalized ? lastBlock.blockId : lastBlock.blockId - 1
      );
      const proofs = await apiClient.getProofs(leaves.slice(0, 10).map((leaf) => leaf.key));

      // console.log(JSON.stringify(proofs));

      expect(proofs).be.an('object');
      expect(proofs).to.have.nested.property('block.blockId').that.is.a('number');
      expect(proofs).to.have.property('keys').that.is.an('array');
      expect(proofs).to.have.property('leaves').that.is.an('array');

      if (proofs) {
        expect(proofs.leaves.length).to.gt(0);

        proofs.leaves.forEach((leaf) => {
          expect(leaf.proof.length).to.gt(0);
        });
      }
    });
  });

  describe('#verifyProofForBlock', () => {
    it('expect to return valid result', async () => {
      const verificationResult = await apiClient.verifyProofForNewestBlock('UMB-USD');

      expect(verificationResult).be.an('object');
      expect(verificationResult).to.have.property('success').that.is.a('boolean');
      expect(verificationResult).to.have.property('value').that.is.a('number');
      expect(verificationResult).to.have.property('dataTimestamp').that.is.a('Date');
      expect(verificationResult.value).gt(0);
    });

    it('expect to return invalid result', async () => {
      const verificationResult = apiClient.verifyProofForNewestBlock('xxx');

      await expect(verificationResult).to.throws;
    });
  });
});
