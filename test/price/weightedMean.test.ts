import {AssertionError} from 'assert';
import {expect} from 'chai';

import {weightedMean} from '../../src/price';

describe('weightedMean()', () => {
  const dataToTest: [[number, number][], number][] = [
    [[[100, 2], [50, 4], [25, 1]], 60.714285714285715],
    [[[100, 2], [1000, 0]], 100.0],
  ];

  dataToTest.forEach(arr => {
    const [values, expected] = arr;

    it(`expect weightedMean of ${JSON.stringify(values)} to be equal to ${expected}`, () => {
      expect(weightedMean(values)).to.eq(expected);
    });
  });

  it('expect weights to be non negative', () => {
    expect(() => weightedMean([[1, -4], [25, 1]])).to.throws(AssertionError);
  });
});
