import { expect } from 'chai';
import { RPCSelector } from '../../src/services/RPCSelector';
import { JsonRpcProvider, Block } from '@ethersproject/providers';
import sinon from 'sinon';

describe.only('RPCSelector', () => {
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

    describe('when there are multiple URLs', () => {
      describe('when the preferred URL is up to date', () => {
        const stubValue = {
          timestamp: Math.floor(Date.now() / 1000) - 30,
        } as Block;

        it('returns the preferred URL without checking the complementary RPCs', async () => {
          const mockedGetBlock = sinon.stub(JsonRpcProvider.prototype, 'getBlock').resolves(stubValue);
          const mockedGetBlockNumber = sinon.stub(JsonRpcProvider.prototype, 'getBlockNumber').resolves(100_000);

          const urls = [
            'https://data-seed-prebsc-1-s2.binance.org:8545/',
            'https://data-seed-prebsc-2-s3.binance.org:8545/',
          ];
          const rpcSelector = new RPCSelector(urls);

          expect(await rpcSelector.apply()).to.eq(urls[0]);
          expect(mockedGetBlockNumber.notCalled);

          mockedGetBlock.restore();
          mockedGetBlockNumber.restore();
        });
      });

      describe('when the preferred URL is not up to date', () => {
        const stubValue = {
          timestamp: Math.floor(Date.now() / 1000) - 120,
        } as Block;

        it('returns the RPC with highest block number', async () => {
          const mockedGetBlock = sinon.stub(JsonRpcProvider.prototype, 'getBlock').resolves(stubValue);
          const mockedGetBlockNumber = sinon.stub(JsonRpcProvider.prototype, 'getBlockNumber').resolves(100_000);

          const urls = [
            'https://data-seed-prebsc-1-s1.binance.org:8545/',
            'https://data-seed-prebsc-1-s2.binance.org:8545/',
          ];

          const rpcSelector = new RPCSelector(urls, 100);

          expect(await rpcSelector.apply()).to.eq(urls[1]);
          expect(mockedGetBlock.called);

          mockedGetBlock.restore();
          mockedGetBlockNumber.restore();
        });
      });

      describe('when all RPCs exceeds request time threshold', () => {
        const fakeGetBlock = (): Promise<Block> => {
          return new Promise((resolve) => {
            setTimeout(resolve, 5000, { timestamp: Math.floor(Date.now() / 1000) });
          });
        };

        const fakeGetBlockNumber = (): Promise<number> => {
          return new Promise((resolve) => {
            setTimeout(resolve, 5000, 100_000);
          });
        };

        it('timeouts and selects the first of the non-preferred RPCs', async () => {
          const mockedGetBlock = sinon.stub(JsonRpcProvider.prototype, 'getBlock').callsFake(fakeGetBlock);
          const mockedGetBlockNumber = sinon
            .stub(JsonRpcProvider.prototype, 'getBlockNumber')
            .callsFake(fakeGetBlockNumber);

          const urls = [
            'https://data-seed-prebsc-1-s1.binance.org:8545/',
            'https://data-seed-prebsc-1-s2.binance.org:8545/',
          ];

          const rpcSelector = new RPCSelector(urls, 500);
          expect(await rpcSelector.apply()).to.eq(urls[1]);

          mockedGetBlock.restore();
          mockedGetBlockNumber.restore();
        });

        it('runs close to the threshold time', async () => {
          const mockedGetBlock = sinon.stub(JsonRpcProvider.prototype, 'getBlock').callsFake(fakeGetBlock);
          const mockedGetBlockNumber = sinon
            .stub(JsonRpcProvider.prototype, 'getBlockNumber')
            .callsFake(fakeGetBlockNumber);

          const urls = [
            'https://data-seed-prebsc-1-s1.binance.org:8545/',
            'https://data-seed-prebsc-1-s2.binance.org:8545/',
          ];

          const rpcSelector = new RPCSelector(urls, 200);

          const start = Date.now();
          await rpcSelector.apply();
          const duration = Date.now() - start;

          // we're running the timeout two times.
          // so it's expected that the runtime is roughly
          // the configured timeout * 2.
          const expectedRuntime = 450;
          expect(duration).to.be.lessThan(expectedRuntime);

          mockedGetBlock.restore();
          mockedGetBlockNumber.restore();
        });
      });
    });
  });
});
