import BigNumber from 'bignumber.js';
import { expect } from 'chai';
import { LeafValueCoder } from '../../src/';
import { NUMERIC_MULTIPLIER, SIGNED_NUMBER_PREFIX, MAX_UINT224_BN, MIN_INT_224_BN } from '../../src/constants';

describe('LeafValueCoder', () => {
  describe('test isSignedValue()', async () => {
    const testCases = [
      { input: 'SIGN_TEST_LABEL', expected: true },
      { input: 'SIGNS_TEST_LABEL', expected: false },
      { input: 'FIXED_TEST_LABEL', expected: false },
      { input: '0x0000000000000000000000000000000000000000', expected: false },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`check label ${input} => is sign prefix? expect ${expected}`, async () => {
        expect(LeafValueCoder.isSignedValue(input)).to.eq(expected);
      });
    });
  });

  describe('test signedValueToHex()', async () => {
    const testCases = [
      { input: new BigNumber(0), expected: '0' },
      { input: new BigNumber(1), expected: '1' },
      { input: MIN_INT_224_BN, expected: MAX_UINT224_BN.plus(1).div(2).toString(16) },
      { input: new BigNumber(-1), expected: MAX_UINT224_BN.toString(16) },
      {
        input: new BigNumber(Number.MAX_SAFE_INTEGER, 10).times(NUMERIC_MULTIPLIER),
        expected: '1bc16d674ec7ff21f494c589c0000',
      },
      {
        input: new BigNumber(Number.MIN_SAFE_INTEGER, 10).times(NUMERIC_MULTIPLIER),
        expected: 'fffffffffffffffffffffffffffe43e9298b13800de0b6b3a7640000',
      },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`convert number ${input} to hex => expect ${expected}`, async () => {
        expect(LeafValueCoder.signedValueToHex(input)).to.eq(expected);
      });
    });
  });

  describe('test toInt()', async () => {
    const testCases = [
      { input: new BigNumber(0), expected: new BigNumber(0) },
      { input: new BigNumber(1), expected: new BigNumber(1) },
      { input: MAX_UINT224_BN.plus(1).div(2), expected: MIN_INT_224_BN },
      { input: MAX_UINT224_BN, expected: new BigNumber(-1) },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`convert int ${input} to int => expect ${expected}`, async () => {
        expect(LeafValueCoder.toInt(input).eq(expected)).to.eq(true);
      });
    });
  });

  describe('test decoder', async () => {
    const testCases = [
      { input: '0x' + new BigNumber(0).times(NUMERIC_MULTIPLIER).toString(16), expected: 0 },
      { input: '0x' + new BigNumber(1).times(NUMERIC_MULTIPLIER).toString(16), expected: 1 },
      {
        input: '0x000000000000000000000000000000000001bc16d674ec7ff21f494c589c0000',
        expected: Number.MAX_SAFE_INTEGER,
      },
      {
        input: '0x00000000fffffffffffffffffffffffffffe43e9298b13800de0b6b3a7640000',
        expected: Number.MIN_SAFE_INTEGER,
      },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`decode ${input} => expect ${expected}`, async () => {
        const decoded = LeafValueCoder.decode(input, SIGNED_NUMBER_PREFIX);
        expect(decoded).to.eq(expected);
      });
    });
  });

  describe('test encoder', async () => {
    const values = [
      0,
      0.012,
      1,
      15151515,
      -17,
      34,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      -1,
      -4564563,
      -14.1554,
      -0.2151,
    ];
    values.forEach((value) => {
      it(`expect to encode and decode numbers ${value}`, async () => {
        const leaf = LeafValueCoder.encode(value, SIGNED_NUMBER_PREFIX).toString('hex');
        const decoded = LeafValueCoder.decode(leaf, SIGNED_NUMBER_PREFIX);
        expect(decoded).to.eql(value);
      });
    });
  });
});
