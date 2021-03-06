import {expect} from 'chai';
import {LeafValueCoder, converters} from '../../src/';
import {LeafType} from '../../src';

describe('converters', () => {
  it('expect to have converters', () => {
    expect(converters.numberToUint256).not.to.be.undefined;
  });
});

describe('floating point numbers', () => {
  const numbers: number[] = [1.1, 0.8359, 73.74, 1.56, 0.94, 590.39, 0.01234, 0.0000001, 123456789.0001, 0.0000000254];

  numbers.forEach(f => {
    it(`expect to encode and decode leaf value ${f}`, () => {
      const leaf = LeafValueCoder.encode(f, LeafType.TYPE_FLOAT).toString('hex');
      expect(LeafValueCoder.decode(leaf)).to.eql(f);
    });
  });
});
