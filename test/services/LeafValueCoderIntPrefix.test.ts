import { expect } from 'chai';
import { LeafValueCoder } from '../../src/';
import { INT_PREFIX } from '../../src/constants';

const maxUint224 = BigInt('0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
const maxInt224 = (maxUint224 - 1n) / 2n;
const minInt224 = (maxInt224 + 1n) * -1n;

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
      { input: minInt224, expected: ((maxUint224 + 1n) / 2n).toString(16) },
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
      { input: 0n, expected: 0n },
      { input: 1n, expected: 1n },
      { input: (maxUint224 + 1n) / 2n, expected: minInt224 },
      { input: maxUint224, expected: -1n },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`convert int ${input} to int => expect ${expected}`, async () => {
        expect(LeafValueCoder.toInt(input)).to.eq(expected);
      });
    });
  });

  describe('test decoder', async () => {
    const testCases = [
      { input: '0x' + 0n.toString(16), expected: 0n },
      { input: '0x' + 1n.toString(16), expected: 1n },
      { input: '0x' + ((maxUint224 + 1n) / 2n).toString(16), expected: minInt224 },
      { input: '0x' + maxUint224.toString(16), expected: -1n },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`decode ${input} => expect ${expected}`, async () => {
        const decoded = LeafValueCoder.decode(input, INT_PREFIX);
        expect(decoded).to.eq(expected);
      });
    });
  });

  describe('test encoder', async () => {
    const values = [0n, 1n, maxInt224, minInt224, -1n];
    values.forEach((value) => {
      it(`expect to encode and decode integers ${value}`, async () => {
        const leaf = LeafValueCoder.encode(value, INT_PREFIX).toString('hex');
        const decoded = LeafValueCoder.decode(leaf, INT_PREFIX);
        expect(decoded).to.eql(value);
      });
    });
  });
});
