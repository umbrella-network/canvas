/* eslint-disable no-empty */
import { Wallet, providers } from 'ethers';
import { expect } from 'chai';
import sinon from 'sinon';
import { stubConstructor, StubbedInstance } from 'ts-sinon';

import { TxSender } from '../../src/services/TxSender';
import { GasEstimator } from '../../src/services/GasEstimator';
import { GasEstimation } from '../../src/types/GasEstimation';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import { Wallet as FakeWallet } from '../mocks/Wallet';

const makeFakeTransactionFunction = (result?: { status: number }) => {
  return async () =>
    ({
      wait: () => Promise.resolve(result as TransactionReceipt),
    } as TransactionResponse);
};

describe('TxSender', () => {
  describe('when waitForBlockTime is not provided', () => {
    it('sets 500ms as default', () => {
      const subject = new TxSender({ wallet: {} as Wallet, chainId: 'eth' });
      expect(subject.waitForBlockTime).to.be.equal(500);
    });
  });

  describe('#apply', () => {
    let fakeWallet: Wallet;
    let fakeProvider: StubbedInstance<providers.BaseProvider>;
    let txSender: TxSender;

    before(() => {
      fakeProvider = stubConstructor(providers.JsonRpcProvider);
      fakeWallet = Wallet.createRandom().connect(fakeProvider);
    });

    beforeEach(() => {
      // TxSender needs a new block number every time
      for (let i = 0; i < 10; i++) {
        fakeProvider.getBlockNumber.onCall(i /* calls start at 0 */).resolves(100_000 + i);
      }

      sinon.stub(GasEstimator, 'apply').resolves({
        gasPrice: 100,
        maxPriorityFeePerGas: 100,
        maxFeePerGas: 100,
        isTxType2: true,
      } as GasEstimation);
    });

    afterEach(() => {
      fakeProvider.getBlockNumber.reset();
      sinon.restore();
    });

    describe('when transaction is submitted successfully', () => {
      before(() => {
        txSender = new TxSender({ wallet: fakeWallet, chainId: 'eth' });
      });

      //* This test is not exiting. This suggests
      //* that one asynchronous operation is not being finalized.
      it('resolves the transaction receipt', async () => {
        const fakeTransactionFunction = makeFakeTransactionFunction({ status: 1 });
        const subject = await txSender.apply(fakeTransactionFunction, 100, 500, 0.01);
        expect(subject.status).to.be.equal(1);
      });
    });

    describe('when transaction is not submitted successfully', () => {
      beforeEach(() => {
        // casting is necessary to ensure compatibility.
        fakeWallet = new FakeWallet(fakeProvider) as unknown as Wallet;
        txSender = new TxSender({ wallet: fakeWallet, chainId: 'eth' });
      });

      it('attempts to cancel the pending transaction', async () => {
        const spy = sinon.spy(fakeWallet, 'getTransactionCount');
        const fakeTransactionFunction = makeFakeTransactionFunction();

        try {
          await txSender.apply(fakeTransactionFunction, 100, 500, 0.01);
        } catch {}

        expect(spy.called).to.be.true;
      });

      it('throws a timeout error', async () => {
        const fakeTransactionFunction = makeFakeTransactionFunction();

        const subject = txSender.apply(fakeTransactionFunction, 100, 500, 0.01);
        expect(subject).to.eventually.throw('mint TX timeout');
      });

      describe('when transaction is canceled successfully', () => {
        it('does not try to re-send the cancelling transaction', async () => {
          const expectedCallCount = 4;
          const fakeTransactionFunction = makeFakeTransactionFunction();

          try {
            await txSender.apply(fakeTransactionFunction, 100, 500, 0.01);
          } catch {}

          expect(fakeProvider.getBlockNumber.callCount).to.eql(expectedCallCount);
        });
      });

      describe('when transaction is not canceled successfully', () => {
        describe('when replacement fee is too low', () => {
          it('re-send the cancelling transaction with different gas', async () => {
            const firstCancellationAttemptCall = 3;
            const error = new Error('replacement fee too low');
            fakeProvider.getBlockNumber.onCall(firstCancellationAttemptCall).rejects(error);

            const expectedCallCount = 6;
            const fakeTransactionFunction = makeFakeTransactionFunction();

            try {
              await txSender.apply(fakeTransactionFunction, 100, 500, 0.01);
            } catch {}

            expect(fakeProvider.getBlockNumber.callCount).to.eql(expectedCallCount);
          });

          describe('when last attempt fails', () => {
            it('throws an error', () => {
              const firstCancellationAttemptCall = 3;
              const lastCancellationAttemptCall = 4;
              const error = new Error('replacement fee too low');

              fakeProvider.getBlockNumber.onCall(firstCancellationAttemptCall).rejects(error);
              fakeProvider.getBlockNumber.onCall(lastCancellationAttemptCall).rejects(error);

              const fakeTransactionFunction = makeFakeTransactionFunction();

              const subject = txSender.apply(fakeTransactionFunction, 100, 500, 0.01);
              expect(subject).to.eventually.throw();
            });
          });
        });

        describe('when any other error occurs', () => {
          it('throws an error', async () => {
            const firstCancellationAttemptCall = 3;
            const error = new Error('other error');
            fakeProvider.getBlockNumber.onCall(firstCancellationAttemptCall).rejects(error);

            const fakeTransactionFunction = makeFakeTransactionFunction();

            const subject = txSender.apply(fakeTransactionFunction, 100, 500, 0.01);
            expect(subject).to.eventually.throw('other error');
          });
        });
      });
    });
  });
});
