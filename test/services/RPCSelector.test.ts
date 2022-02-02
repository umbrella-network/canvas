import { expect } from 'chai';
import { RPCSelector } from '../../src/services/RPCSelector';
import sinon from 'sinon';
import { providers } from 'ethers';

describe('RPCSelector', () => {
  describe('#selectByTimestamp', () => {
    describe('when there is only one URL', () => {
      it('returns the URL without checking the timestamp', async () => {
        const spy = sinon.spy(providers.JsonRpcProvider.prototype, 'getBlock');

        const rpcSelector = new RPCSelector('http://127.0.0.1:8545');
        const result = await rpcSelector.selectByTimestamp();

        expect(result).to.eql('http://127.0.0.1:8545');
        expect(spy.notCalled).to.be.true;

        spy.restore();
      });
    });

    describe('when there are multiple URLs', () => {
      it('returns the first up-to-date URL', async () => {
        const fakeTimestampInSeconds = Math.floor(Date.now() / 1000);
        const stub = sinon.stub(providers.JsonRpcProvider.prototype, 'getBlock');

        stub.onFirstCall().resolves({ timestamp: fakeTimestampInSeconds - 600 } as providers.Block);
        stub.onSecondCall().resolves({ timestamp: fakeTimestampInSeconds - 10 } as providers.Block);

        const rpcSelector = new RPCSelector('http://out-of-date-rpc:8545,http://up-to-date-rpc:8545');
        const result = await rpcSelector.selectByTimestamp();

        expect(result).to.eql('http://up-to-date-rpc:8545');
        expect(stub.callCount).to.be.eq(2);

        stub.restore();
      });
    });
  });

  describe('#selectByLatestBlockNumber', () => {
    describe('when there is only one URL', () => {
      it('returns the URL without comparing block numbers', async () => {
        const spy = sinon.spy(providers.JsonRpcProvider.prototype, 'getBlockNumber');

        const rpcSelector = new RPCSelector('http://127.0.0.1:8545');
        const result = await rpcSelector.selectByLatestBlockNumber();

        expect(result).to.eql('http://127.0.0.1:8545');
        expect(spy.notCalled).to.be.true;

        spy.restore();
      });
    });

    describe('when there are multiple URLs', () => {
      it('returns the URL with the highest block number', async () => {
        const fakeBlockNumber = 100_000;
        const stub = sinon.stub(providers.JsonRpcProvider.prototype, 'getBlockNumber');

        stub.onFirstCall().resolves(fakeBlockNumber - 600);
        stub.onSecondCall().resolves(fakeBlockNumber);

        const rpcSelector = new RPCSelector('http://out-of-date-rpc:8545,http://up-to-date-rpc:8545');
        const result = await rpcSelector.selectByLatestBlockNumber();

        expect(result).to.eql('http://up-to-date-rpc:8545');
        expect(stub.callCount).to.be.eq(2);

        stub.restore();
      });
    });
  });
});
