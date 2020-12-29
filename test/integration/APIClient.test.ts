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
      it('expect to work', async () => {
        const blocks = await apiClient.getBlocks();
        expect(blocks).be.an('array');

        blocks.forEach((block) => {
          expect(block).be.an('object');
          expect(block).to.have.property('_id').that.is.a('string');
        });
      });
    });

    describe('#getBlock', () => {
      it('expect to work', async () => {
        const blocks = await apiClient.getBlocks();
        const blockId = blocks[0]._id;

        const block = await apiClient.getBlock(blockId);

        expect(block).be.an('object');
        expect(block).to.have.property('_id').that.is.a('string');
      });
    });

    describe('#getLeavesOfBlock', async () => {
      it('expect to work', async () => {
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
