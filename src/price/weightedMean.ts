import assert from 'assert';

export const weightedMean = (weightedValues: [number, number][]): number => {
  const totalWeight = weightedValues.reduce(function (sum, weightedValue) {
    assert(weightedValue[1] >= 0, 'Weight should not be negative');

    return sum + weightedValue[1];
  }, 0);

  return weightedValues.reduce(function (mean, weightedValue) {
    return mean + weightedValue[0] * weightedValue[1] / totalWeight;
  }, 0);
};
