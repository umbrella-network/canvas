import {expect} from 'chai';

import {mean} from '../../src/price';

describe('mean()', () => {
  const dataToTest: [number[], number][] = [
    [[1, 2, 3, 4, 4, 6], 3.3333333333333333],
    [[5, 13, 2], 6.666666666666667],
    [[2, 4, 4], 3.3333333333333333],
  ];

  dataToTest.forEach(arr => {
    const [values, expected] = arr;

    it(`expect mean of ${JSON.stringify(values)} to be equal to ${expected}`, () => {
      expect(mean(values)).to.eq(expected);
    });
  });
});
