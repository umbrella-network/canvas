import {mean} from './mean';
import type {BarPrice} from './types';

/**
 * Time-Weighted Average Price
 * @param values bar values
 */
export const TWAPMean = (values: BarPrice[]): number => {
  const adjustedValues = values.map(function ({open, close, high, low}) {
    return 0.25 * (open + close + low + high);
  });

  return mean(adjustedValues);
};
