import BigNumber from 'bignumber.js';
import { FIXED_NUMBER_PREFIX, NUMERIC_MULTIPLIER, INT_PREFIX, MAX_UINT224_HEX } from '../constants';
import { utils } from 'ethers';
import { evenHex, prepend0x } from '../utils/helpers';
import { FeedValue } from '../types/Feed';
const maxUint224 = new BigNumber(MAX_UINT224_HEX);
const maxInt224 = maxUint224.minus(1).div(2);
const minInt224 = maxInt224.plus(1).times(-1);

export class LeafValueCoder {
  /**
   *
   * @param n {number | string}
   * @param label
   * @param bits
   */
  static encode = (n: FeedValue, label: string, bits = 256): Buffer => {
    if (LeafValueCoder.isFixedValue(label)) {
      return LeafValueCoder.encodeHex(LeafValueCoder.fixedValueToHex(n), bits);
    }

    if (LeafValueCoder.isIntValue(label)) {
      return LeafValueCoder.encodeHex(LeafValueCoder.intValueToHex(new BigNumber(n, 10)), bits);
    }

    return LeafValueCoder.encodeHex(new BigNumber(n, 10).times(NUMERIC_MULTIPLIER).toString(16), bits);
  };

  static encodeHex = (leafAsHex: string, bits = 256): Buffer => {
    if (!utils.isHexString(prepend0x(leafAsHex))) {
      throw Error(`${leafAsHex} is not valid hex value`);
    }

    const bytes = bits / 8;
    const buff32 = Buffer.alloc(bytes).fill(0);
    const value = Buffer.from(evenHex(leafAsHex), 'hex');
    value.copy(buff32, bytes - value.length);
    return buff32;
  };

  /**
   *
   * @param leafAsHex {string} data in hex format
   * @param label {string}
   */
  static decode = (leafAsHex: string, label: string): number | string => {
    const bn = new BigNumber(leafAsHex, 16);

    if (LeafValueCoder.isFixedValue(label)) {
      return bn.toFixed();
    }

    if (LeafValueCoder.isIntValue(label)) {
      return LeafValueCoder.toInt(bn);
    }

    return bn.div(NUMERIC_MULTIPLIER).toNumber();
  };

  /**
   * Omits unnecessary parts from the key
   * @param label {string}
   */
  static printableKey = (label: string): string => {
    if (LeafValueCoder.isFixedValue(label)) {
      return label.slice(FIXED_NUMBER_PREFIX.length);
    }

    return label;
  };

  /**
   * Omits unnecessary parts from the key
   * @param leafAsHex
   * @param label {string}
   */
  static printableValue = (leafAsHex: string, label: string): string => {
    if (LeafValueCoder.isFixedValue(label)) {
      return leafAsHex;
    }

    return LeafValueCoder.decode(leafAsHex, label).toString();
  };

  static isFixedValue = (label: string): boolean => label.startsWith(FIXED_NUMBER_PREFIX);

  private static fixedValueToHex = (n: FeedValue): string => {
    if (typeof n === 'number') {
      return n.toString(16);
    }

    return new BigNumber(n || '0', n.startsWith('0x') ? 16 : 10).toString(16);
  };

  static isIntValue = (label: string): boolean => label.startsWith(INT_PREFIX);

  static intValueToHex = (n: BigNumber | number): string => {
    if (n >= 0) {
      return n.toString(16);
    }

    return maxUint224.plus(n).plus(1).toString(16);
  };

  static toInt = (n: BigNumber): number => {
    if (maxInt224.gte(n)) {
      return n.toNumber();
    }

    return minInt224.plus(n.minus(maxInt224).minus(1)).toNumber();
  };
}
