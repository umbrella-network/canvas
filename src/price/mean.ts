import assert from 'assert';

export const mean = (values: number[]): number => {
  assert(values.length > 0);

  const total = values.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  return total / values.length;
};
