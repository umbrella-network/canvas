import { FeeData } from '@ethersproject/abstract-provider';
import { EstimateParams, GasEstimation } from '../types/GasEstimation';

export class Type2GasEstimator {
  public static estimate(params: EstimateParams): GasEstimation {
    const baseFee = Math.min(Math.max(params.metrics.baseFeePerGas, params.minGasPrice), params.maxGasPrice);
    const maxPriorityFeePerGas = Type2GasEstimator.calcMaxPriorityFeePerGas(params.maxPriorityFees, params.feeData);
    const maxFeePerGas = Type2GasEstimator.calcMaxFeePerGas(baseFee, params.maxGasPrice, maxPriorityFeePerGas);

    return {
      ...params.metrics,
      gasPrice: baseFee,
      maxPriorityFeePerGas,
      // polygon gas is so crazy, that it is possible to maxFeePerGas < maxPriorityFeePerGas, this is a fix:
      maxFeePerGas: maxFeePerGas < maxPriorityFeePerGas ? maxPriorityFeePerGas + baseFee : maxFeePerGas,
    };
  }

  private static calcMaxPriorityFeePerGas(fees: number[], feeData: FeeData): number {
    const minFee = Math.max(feeData.maxPriorityFeePerGas?.toNumber() || 2.5, 1.5);

    const sortedFees = fees.sort(Type2GasEstimator.fromLowestToHighest);
    const bottomFees = sortedFees
      // We are ignoring the top 20% of prices because usually
      // people or bots put absurdly high gas prices.
      // 20% is just an estimate.
      .slice(0, Math.ceil((sortedFees.length - 1) * 0.8))
      .filter((p) => p >= minFee);

    const sum = bottomFees.reduce((acc, sum) => acc + sum, 0);

    if (sum === 0) return minFee;

    const avg = Math.trunc(sum / bottomFees.length);
    // get price that is in a middle
    const estimatedFee = bottomFees.filter((p) => p < avg).pop() || bottomFees.pop() || 0;
    return Math.ceil(Math.max(minFee, estimatedFee));
  }

  // Doubling the Base Fee when calculating the Max Fee ensures that your transaction
  // will remain marketable for six consecutive 100% full blocks.
  private static calcMaxFeePerGas(baseFee: number, maxGasPrice: number, maxPriorityFee = 0): number {
    const maxFeePrice = 2 * baseFee + maxPriorityFee;
    return Math.min(maxGasPrice, maxFeePrice);
  }

  private static fromLowestToHighest(a: number, b: number): number {
    return a - b;
  }
}
