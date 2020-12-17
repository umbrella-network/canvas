import assert from 'assert';

export const median = (values: number[]): number => {
  assert(values.length > 0);

  values.sort((a, b) => {
    return a - b;
  });

  const half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
};
