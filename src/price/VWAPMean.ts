import type {BarPrice} from './types';

/**
 * Volume-Weighted Average Price
 * @param values bar and volume values
 */
export const VWAPMean = (values: [BarPrice, number][]): number => {
  let cumulativeVolume = 0, result = 0, mean = 0;
  values.forEach(([{close, low, high}, volume]) => {
    const price = (close + low + high) / 3;
    cumulativeVolume += volume;
    mean = mean + price * volume;
    result = mean / cumulativeVolume;
  }, 0);

  return result;
};
