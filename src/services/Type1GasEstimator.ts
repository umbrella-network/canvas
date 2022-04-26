import { EstimateParams, GasEstimation } from '../types/GasEstimation';

export class Type1GasEstimator {
  public static estimate(params: EstimateParams): GasEstimation {
    const baseFee = params.prices.length > 2 ? Type1GasEstimator.calculateBaseGasPrice(params) : params.currentGasPrice;

    return {
      ...params.metrics,
      gasPrice: baseFee,
      maxPriorityFeePerGas: 0,
      maxFeePerGas: 0,
    };
  }

  public static calculateBaseGasPrice(params: EstimateParams): number {
    const { prices, minGasPrice, maxGasPrice, metrics } = params;

    const estimatedPrice = Type1GasEstimator.getEstimatedPrice(prices, minGasPrice);

    if (!estimatedPrice) {
      return minGasPrice;
    }

    return Math.ceil(Math.min(maxGasPrice, Math.max(minGasPrice, estimatedPrice, metrics.avg))) + 1;
  }

  private static getEstimatedPrice(prices: number[], minGasPrice: number): number | undefined {
    const eligibleGasPrices = Type1GasEstimator.getEligibleGasPrices(prices, minGasPrice);

    const sum = eligibleGasPrices.reduce((acc, price) => acc + price, 0);
    const avg = sum / eligibleGasPrices.length;
    const estimatedPrice = eligibleGasPrices.filter((p) => p < avg).pop(); // get price that is in a middle

    return estimatedPrice;
  }

  private static getEligibleGasPrices(prices: number[], minGasPrice: number): number[] {
    const sortedPrices = prices.sort(Type1GasEstimator.fromLowestToHighest);
    const eligibleGasPrices = sortedPrices
      // We are ignoring the top 10% of prices because usually
      // people or bots put absurdly high gas prices.
      // 10% is just an estimate.
      .slice(0, Math.ceil((sortedPrices.length - 1) * 0.9))
      .filter((p) => p >= minGasPrice);
    return eligibleGasPrices;
  }

  private static fromLowestToHighest(a: number, b: number): number {
    return a - b;
  }
}
