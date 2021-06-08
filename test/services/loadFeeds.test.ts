import dotenv from 'dotenv';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { loadFeeds } from '../../src';

const expect = chai.expect;
chai.use(chaiAsPromised);

dotenv.config();

describe('LoadFeeds', () => {
  describe('when loading a valid local yaml file', () => {
    it('returns the proper object representation', async () => {
      const feeds = await loadFeeds('test/fixtures/feeds-example.yaml');

      const keys = Object.keys(feeds);
      expect(feeds).to.have.keys('BTC-USDT', 'BTC-USD', 'ETH-USDT', 'ETH-USD');
      expect(keys).to.have.length(4);
      expect(feeds[keys[0]]).to.have.property('discrepancy');
      expect(feeds[keys[0]]).to.have.property('precision');
      expect(feeds[keys[0]]).to.have.property('inputs');
    });
  });

  describe('when loading from a valid url', () => {
    it('returns the proper object representation', async () => {
      const feeds = await loadFeeds(process.env.FEEDS_URL as string);

      const keys = Object.keys(feeds);
      expect(keys).to.have.length.greaterThan(1);
      expect(feeds[keys[0]]).to.have.property('discrepancy');
      expect(feeds[keys[0]]).to.have.property('precision');
      expect(feeds[keys[0]]).to.have.property('inputs');
    });
  });

  describe('when loading from a bad yaml file', () => {
    it('throws an error', async () => {
      expect(loadFeeds('test/fixtures/feeds-example-bad.yaml')).to.eventually.be.rejectedWith(
        'Error: Feeds validation error (pass 2):'
      );
    });
  });
});
