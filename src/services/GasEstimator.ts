import { BlockWithTransactions, FeeData, TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, ethers } from 'ethers';

import { Type1GasEstimator } from './Type1GasEstimator';
import { Type2GasEstimator } from './Type2GasEstimator';
import { GasEstimation, EstimateParams } from '../types/GasEstimation';
import { formatWeiToGwei } from '../utils/helpers';

export class GasEstimator {
  public static async apply(
    provider: ethers.providers.Provider,
    minGasPrice: number,
    maxGasPrice: number
  ): Promise<GasEstimation> {
    const [block, currentGasPrice, feeData] = await GasEstimator.fetchProviderInfo(provider);

    const [metrics, prices, maxPriorityFees] = GasEstimator.getGasMetricsFor(block);

    return GasEstimator.estimate({
      currentGasPrice: currentGasPrice.toNumber(),
      feeData,
      metrics,
      prices,
      minGasPrice,
      maxGasPrice,
      maxPriorityFees,
    });
  }

  public static printable(metrics: GasEstimation): string {
    const { gasPrice, maxPriorityFeePerGas, maxFeePerGas, min, max, avg, isTxType2, baseFeePerGas } = metrics;

    return (
      `isTxType2: ${isTxType2 ? 'yes' : 'no'}, ` +
      `gasPrice: ${formatWeiToGwei(gasPrice)} Gwei, ` +
      `baseFeePerGas: ${baseFeePerGas > 1e6 ? formatWeiToGwei(baseFeePerGas) + ' Gwei' : baseFeePerGas}, ` +
      `maxPriorityFee: ${maxPriorityFeePerGas ? formatWeiToGwei(maxPriorityFeePerGas) : '-'} Gwei, ` +
      `maxFee: ${maxFeePerGas ? formatWeiToGwei(maxFeePerGas) : '-'} Gwei, ` +
      `min: ${formatWeiToGwei(min)} Gwei, ` +
      `max: ${formatWeiToGwei(max)} Gwei, ` +
      `avg: ${formatWeiToGwei(avg)} Gwei`
    );
  }

  private static async fetchProviderInfo(
    provider: ethers.providers.Provider
  ): Promise<[BlockWithTransactions, BigNumber, FeeData]> {
    return Promise.all([provider.getBlockWithTransactions('latest'), provider.getGasPrice(), provider.getFeeData()]);
  }

  private static getGasMetricsFor(
    block: BlockWithTransactions
  ): [gasPriceMetrics: GasEstimation, prices: number[], maxPriorityFees: number[]] {
    const isTxType2 = Boolean(block.baseFeePerGas);
    const transactions = block.transactions.filter(GasEstimator.containsGasPrice);

    if (transactions.length === 0) {
      return [{ min: 0, max: 0, avg: 0, baseFeePerGas: 0, gasPrice: 0, isTxType2 }, [], []];
    }

    const prices = transactions.map(GasEstimator.getGasPrice);
    const fees = transactions.filter(GasEstimator.containsFees).map(GasEstimator.getFee);
    const averageGasPrice = prices.reduce((acc, gas) => acc + gas, 0) / prices.length;
    const [min, max] = GasEstimator.getMinAndMaxGasPrices(transactions);

    return [
      {
        isTxType2,
        min,
        max,
        avg: averageGasPrice,
        gasPrice: 0,
        baseFeePerGas: block.baseFeePerGas?.toNumber() || 0,
      },
      prices,
      fees,
    ];
  }

  private static estimate(params: EstimateParams): GasEstimation {
    if (params.metrics.isTxType2) {
      return Type2GasEstimator.estimate(params);
    }
    return Type1GasEstimator.estimate(params);
  }

  private static containsGasPrice({ gasPrice }: TransactionResponse): boolean {
    return Boolean(gasPrice);
  }

  private static getGasPrice({ gasPrice }: TransactionResponse): number {
    return BigNumber.from(gasPrice).toNumber();
  }

  private static containsFees({ maxPriorityFeePerGas }: TransactionResponse): boolean {
    return Boolean(maxPriorityFeePerGas);
  }

  private static getFee({ maxPriorityFeePerGas }: TransactionResponse): number {
    return maxPriorityFeePerGas?.toNumber() || 0;
  }

  private static getMinAndMaxGasPrices(transactions: TransactionResponse[]): [min: number, max: number] {
    const sortedTransactions = GasEstimator.sortGasPrices(transactions);
    const min = sortedTransactions[0];
    const max = sortedTransactions[sortedTransactions.length - 1];
    return [min, max];
  }

  private static sortGasPrices(transactions: TransactionResponse[]): number[] {
    return transactions
      .map(GasEstimator.getGasPrice)
      .sort(GasEstimator.fromLowestToHighest)
      .filter(GasEstimator.isNotZero);
  }

  private static isNotZero(gas: number): boolean {
    return gas > 0;
  }

  private static fromLowestToHighest(a: number, b: number): number {
    return a - b;
  }
}
