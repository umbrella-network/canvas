import { expect } from 'chai';
//import { BigNumber } from 'ethers';
import BigNumber from 'bignumber.js';
import { LeafValueCoder } from '../../src/';
import { INT_PREFIX } from '../../src/constants';

const maxUint224 = new BigNumber('0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
const maxInt224 = maxUint224.minus(1).div(2);
const minInt224 = maxInt224.plus(1).times(-1);

describe('LeafValueCoder', () => {
  describe('test isIntValue()', async () => {
    const testCases = [
      { input: 'INT_TEST_LABEL', expected: true },
      { input: 'INTS_TEST_LABEL', expected: false },
      { input: 'FIXED_TEST_LABEL', expected: false },
      { input: '0x0000000000000000000000000000000000000000', expected: false },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`check label ${input} => is int prefix? expect ${expected}`, async () => {
        expect(LeafValueCoder.isIntValue(input)).to.eq(expected);
      });
    });
  });

  describe('test intValueToHex()', async () => {
    const testCases = [
      { input: 0, expected: '0' },
      { input: 1, expected: '1' },
      { input: minInt224, expected: maxUint224.plus(1).div(2).toString(16) },
      { input: -1, expected: maxUint224.toString(16) },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`convert int ${input} to hex => expect ${expected}`, async () => {
        expect(LeafValueCoder.intValueToHex(input)).to.eq(expected);
      });
    });
  });

  describe('test toInt()', async () => {
    const testCases = [
      { input: 0, expected: 0 },
      { input: 1, expected: 1 },
      { input: maxUint224.plus(1).div(2).toFixed(), expected: minInt224.toNumber() },
      { input: maxUint224.toFixed(), expected: -1 },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`convert int ${input} to int => expect ${expected}`, async () => {
        expect(LeafValueCoder.toInt(new BigNumber(input))).to.eq(expected);
      });
    });
  });

  describe('test decoder', async () => {
    const testCases = [
      { input: new BigNumber(0).toString(16), expected: 0 },
      { input: new BigNumber(1).toString(16), expected: 1 },
      { input: maxUint224.plus(1).div(2).toString(16), expected: minInt224.toNumber() },
      { input: maxUint224.toString(16), expected: -1 },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`decode ${input} => expect ${expected}`, async () => {
        expect(await LeafValueCoder.decode(input, INT_PREFIX)).to.eq(expected);
      });
    });
  });

  describe('test encoder', async () => {
    const values = [0, 1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, -1];
    values.forEach((value) => {
      it(`expect to encode and decode integers ${value}`, async () => {
        const leaf = LeafValueCoder.encode(value, INT_PREFIX).toString('hex');
        expect(LeafValueCoder.decode(leaf, INT_PREFIX)).to.eql(value);
      });
    });
  });
});
