import BigNumber from 'bignumber.js';
import { FIXED_NUMBER_PREFIX, NUMERIC_MULTIPLIER } from '../constants';
import { utils } from 'ethers';
import { evenHex, prepend0x } from '../utils/helpers';
import { FeedValue } from '../types/Feed';

export class LeafValueCoder {
  /**
   *
   * @param n {number | string}
   * @param label
   * @param bits
   */
  static encode = (n: FeedValue, label: string, bits = 256): Buffer => {
    const hex = LeafValueCoder.isFixedValue(label)
      ? LeafValueCoder.fixedValueToHex(n)
      : new BigNumber(n, 10).times(NUMERIC_MULTIPLIER).toString(16);
    return LeafValueCoder.encodeHex(hex, bits);
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
    return LeafValueCoder.isFixedValue(label) ? bn.toFixed() : bn.div(NUMERIC_MULTIPLIER).toNumber();
  };

  static isFixedValue = (label: string): boolean => label.startsWith(FIXED_NUMBER_PREFIX);

  private static fixedValueToHex = (n: FeedValue): string => {
    if (typeof n === 'number') {
      return n.toString(16);
    }

    return new BigNumber(n || '0', n.startsWith('0x') ? 16 : 10).toString(16);
  };
}
