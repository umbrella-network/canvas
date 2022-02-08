import { expect } from 'chai';
import { LeafValueCoder } from '../../src/';
import { FIXED_NUMBER_PREFIX } from '../../src/constants';

describe('LeafValueCoder', () => {
  const numbers: number[] = [1.1, 0.8359, 73.74, 1.56, 0.94, 590.39, 0.01234, 0.0000001, 123456789.0001, 0.0000000254];

  numbers.forEach((f) => {
    it(`expect to encode and decode floating point number ${f}`, () => {
      const leaf = LeafValueCoder.encode(f, '').toString('hex');
      expect(LeafValueCoder.decode(leaf, '')).to.eql(f);
    });
  });

  const hexNumbers: [string, string][] = [
    ['10', '10'],
    ['0xA', '10'],
  ];

  hexNumbers.forEach(([value, result]) => {
    it(`expect to encode and decode fixed data ${value}`, () => {
      const leaf = LeafValueCoder.encode(value, FIXED_NUMBER_PREFIX).toString('hex');
      expect(LeafValueCoder.decode(leaf, FIXED_NUMBER_PREFIX)).to.eql(result);
    });
  });
});
