import dotenv from 'dotenv';
import {APIClient} from '../../src';
import {expect} from 'chai';

dotenv.config();

if (process.env.API_BASE_URL) {
  describe('APIClient()', () => {
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
      it('expect to return a valid result', async () => {
        const keysObjects = await apiClient.getKeys();

        // we will pass all the keys, so we could find some proofs for sure
        const keys = keysObjects.map(keyObject => keyObject.id);
        const proofs = await apiClient.getProofs(keys);

        expect(proofs).be.an('object');
        expect(proofs).to.have.nested.property('block._id').that.is.a('string');
        expect(proofs).to.have.property('keys').that.is.an('array');
        expect(proofs).to.have.property('leaves').that.is.an('array');
      });
    });

    if (process.env.API_KEY) {
      // Here we'll write integration tests for methods, that use API-key-protected APIs
    } else {
      console.warn(
        'Skipping ClientAPI integration tests requiring API_KEY, as it is not provided.'
      );
    }
  });
} else {
  console.warn(
    'Skipping ClientAPI integration tests as API_BASE_URL not provided.'
  );
}
