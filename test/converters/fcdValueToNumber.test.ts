import {fcdValueToNumber} from '../../src/converters';

import {expect} from 'chai';
import {BigNumber} from 'ethers';

describe('fcdValueToNumber()', () => {
  const dataToTest: [string, number][] = [
    ['0', 0],
    ['1', 1e-18],
    ['2000', 2e-15],
    [`3${'0'.repeat(18)}`, 3],
    [`400${'0'.repeat(18)}`, 400],
    ['3322170000000000000000', 3322.17],
  ];

  dataToTest.forEach(arr => {
    const [toConvert, expected] = arr;

    it(`expect to convert ${toConvert} to number ${expected}`, () => {
      expect(fcdValueToNumber(BigNumber.from(toConvert))).to.eql(expected);
    });
  });
});
