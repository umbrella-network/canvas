import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { BigNumber, ethers } from 'ethers';

import { GasEstimator } from '../../src/services/GasEstimator';
import { GasEstimation } from '../../src/types/GasEstimation';
import { BlockWithTransactions, FeeData, TransactionResponse } from '@ethersproject/abstract-provider';

describe('GasEstimator', () => {
  describe('.apply', () => {
    const fakeProvider: StubbedInstance<ethers.providers.BaseProvider> = stubConstructor(ethers.providers.BaseProvider);

    beforeEach(() => {
      fakeProvider.getGasPrice.resolves();
      fakeProvider.getBlockWithTransactions.resolves();
      fakeProvider.getFeeData.resolves();
    });

    before(() => {
      GasEstimator.apply(fakeProvider, 1e6, 1e9).then();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('calls getGasPrice from Provider', () => {
      expect(fakeProvider.getGasPrice.called).to.be.true;
    });

    it('calls getBlockWithTransaction from Provider', () => {
      expect(fakeProvider.getBlockWithTransactions.called).to.be.true;
    });

    it('calls getFeeData from Provider', () => {
      expect(fakeProvider.getFeeData.called).to.be.true;
    });

    describe('when provider fails to retrieve data', () => {
      beforeEach(() => {
        fakeProvider.getGasPrice.rejects();
        fakeProvider.getBlockWithTransactions.rejects();
        fakeProvider.getFeeData.rejects();
      });

      it('throws an error', () => {
        expect(GasEstimator.apply(fakeProvider, 1e6, 1e9)).to.eventually.throw();
      });
    });

    describe('when params are inserted correctly', () => {
      beforeEach(() => {
        fakeProvider.getGasPrice.resolves(BigNumber.from(100));
        fakeProvider.getBlockWithTransactions.resolves({
          transactions: [
            {
              gasPrice: BigNumber.from(100),
              maxPriorityFeePerGas: BigNumber.from(100),
            } as TransactionResponse,
          ],
        } as BlockWithTransactions);
        fakeProvider.getFeeData.resolves(<FeeData>{ maxPriorityFeePerGas: BigNumber.from(100) });
      });

      it('resolves an GasEstimation object', async () => {
        const subject = await GasEstimator.apply(fakeProvider, 1e6, 1e9);
        const expectedKeys = [
          'isTxType2',
          'min',
          'max',
          'avg',
          'baseFeePerGas',
          'gasPrice',
          'maxPriorityFeePerGas',
          'maxFeePerGas',
        ];

        expect(subject).to.have.keys(expectedKeys);
      });

      describe('when latest block does not contain baseFeePerGas', () => {
        let subject: GasEstimation;

        before(async () => {
          subject = await GasEstimator.apply(fakeProvider, 1e6, 1e9);
        });

        it('sets baseFeePerGas to 0', () => {
          expect(subject).to.include({ baseFeePerGas: 0 });
        });

        it('sets maxFeePerGas to 0', () => {
          expect(subject).to.include({ maxFeePerGas: 0 });
        });

        it('sets maxPriorityFeePerGas to 0', () => {
          expect(subject).to.include({ maxPriorityFeePerGas: 0 });
        });
      });

      describe('when latest block contains baseFeePerGas', () => {
        beforeEach(() => {
          fakeProvider.getGasPrice.resolves(BigNumber.from(100));
          fakeProvider.getBlockWithTransactions.resolves({
            baseFeePerGas: BigNumber.from(100),
            transactions: [
              {
                gasPrice: BigNumber.from(100),
                maxPriorityFeePerGas: BigNumber.from(100),
              } as TransactionResponse,
            ],
          } as BlockWithTransactions);
          fakeProvider.getFeeData.resolves(<FeeData>{ maxPriorityFeePerGas: BigNumber.from(100) });
        });

        it('resolves a type 2 transaction estimation', async () => {
          const subject = await GasEstimator.apply(fakeProvider, 1e6, 1e9);

          expect(subject).to.include({ isTxType2: true, baseFeePerGas: 100 });
        });

        describe('when calculated max fee per gas exceeds max gas price', () => {
          it('does not exceeds max fee per gas', async () => {
            const expectedFeePerGas = 1e5;
            const subject = await GasEstimator.apply(fakeProvider, 1e8, expectedFeePerGas);

            expect(subject).to.include({ maxFeePerGas: expectedFeePerGas });
          });
        });

        describe('when calculated max fee per gas does not exceeds max gas price', () => {
          it('recalculates max fee per gas', async () => {
            const maxFeePerGas = 1e6;
            const gasPrice = 100;
            const expectedFeePerGas = 2 * maxFeePerGas + gasPrice;
            const subject = await GasEstimator.apply(fakeProvider, maxFeePerGas, 1e9);

            expect(subject).to.include({ maxFeePerGas: expectedFeePerGas });
          });
        });
      });
    });
  });

  describe('.printable', () => {
    it('returns an string with the gas estimation data', () => {
      const subject = GasEstimator.printable(<GasEstimation>{});

      expect(subject).to.be.an('string');
    });

    describe('when baseFeePerGas is formatted as wei', () => {
      it('formats baseFeePerGas to gwei with "Gwei" suffix', () => {
        const metrics = { baseFeePerGas: 1e9 };

        const subject = GasEstimator.printable(<GasEstimation>metrics);

        expect(subject).to.include('baseFeePerGas: 1 Gwei');
      });
    });

    describe('when baseFeePerGas is already formatted as gwei', () => {
      it('maintains the same baseFeePerGas', () => {
        const metrics = { baseFeePerGas: 1e4 };

        const subject = GasEstimator.printable(<GasEstimation>metrics);

        expect(subject).to.include('baseFeePerGas: 10000');
      });
    });

    describe('when maxPriorityFeePerGas and maxFeePerGas are present', () => {
      let subject: string;

      before(() => {
        const metrics = {
          gasPrice: 1e9,
          min: 1e9,
          max: 1e9,
          avg: 1e9,
          maxPriorityFeePerGas: 1e9,
          maxFeePerGas: 1e9,
          baseFeePerGas: 1e9,
        };

        subject = GasEstimator.printable(<GasEstimation>metrics);
      });

      it('formats maxPriorityFeePerGas to gwei', () => {
        expect(subject).to.include('maxPriorityFee: 1');
      });

      it('formats baseFeePerGas to gwei', () => {
        expect(subject).to.include('maxFee: 1');
      });
    });

    describe('when maxPriorityFeePerGas and maxFeePerGas are not present', () => {
      let subject: string;

      before(() => {
        const metrics = {
          gasPrice: 1e9,
          min: 1e9,
          max: 1e9,
          avg: 1e9,
        };

        subject = GasEstimator.printable(<GasEstimation>metrics);
      });

      it('sets maxPriorityFee to a dash character', () => {
        expect(subject).to.include('maxPriorityFee: -');
      });

      it('sets maxFee to a dash character', () => {
        expect(subject).to.include('maxFee: -');
      });
    });
  });
});
