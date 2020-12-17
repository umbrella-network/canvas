import {expect} from 'chai';

import {median} from '../../src/price';

describe('median()', () => {
  const dataToTest: [number[], number][] = [
    [[1, 2, 3, 4, 5, 6, 7], 4],
    [[5, 13], 9],
    [[2, 4, 4], 4],
  ];

  dataToTest.forEach(arr => {
    const [values, expected] = arr;

    it(`expect median of ${JSON.stringify(values)} to be equal to ${expected}`, () => {
      expect(median(values)).to.eq(expected);
    });
  });
});
