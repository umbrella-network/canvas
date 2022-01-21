import { expect } from 'chai';
import { RPCSelector } from '../../src/services/RPCSelector';

describe('RPCSelector', () => {
  describe('when class is instantiated with a string', () => {
    it('parses the string to an array', () => {
      const rpcSelector = new RPCSelector('http://127.0.0.1:8545');
      expect(rpcSelector.urls).to.be.an('array');
    });
  });

  describe('when class is instantiated with an array', () => {
    it('uses the array string', () => {
      const rpcSelector = new RPCSelector(['http://127.0.0.1:8545']);
      expect(rpcSelector.urls).to.be.an('array');
    });
  });

  describe('#apply', () => {
    describe('when there is a single URL', () => {
      it('returns the preferred URL', async () => {
        const url = 'http://127.0.0.1:8545';
        const rpcSelector = new RPCSelector(url);
        expect(await rpcSelector.apply()).to.eq(url);
      });
    });

    describe('when the preferred URL is up to date', () => {
      it('returns the preferred URL', async () => {
        const urls = [
          'https://data-seed-prebsc-1-s2.binance.org:8545/',
          'https://data-seed-prebsc-2-s3.binance.org:8545/',
        ];
        const rpcSelector = new RPCSelector(urls);
        expect(await rpcSelector.apply()).to.eq(urls[0]);
      });
    });

    describe('when the preferred URL is not up to date', () => {
      it('returns the RPC with highest block number', async () => {
        const urls = [
          'https://data-seed-prebsc-2-s3.binance.org:8545/',
          'https://data-seed-prebsc-1-s2.binance.org:8545/',
        ];
        const rpcSelector = new RPCSelector(urls);
        expect(await rpcSelector.apply()).to.eq(urls[1]);
      });
    });
  });
});
