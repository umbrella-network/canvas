import BigNumber from 'bignumber.js';
import {
  FIXED_NUMBER_PREFIX,
  NUMERIC_MULTIPLIER,
  SIGNED_NUMBER_PREFIX,
  MAX_UINT224_BN,
  MAX_INT_224_BN,
  MIN_INT_224_BN,
} from '../constants';
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
    if (LeafValueCoder.isFixedValue(label)) {
      return LeafValueCoder.encodeHex(LeafValueCoder.fixedValueToHex(n), bits);
    }

    const bn = new BigNumber(n, 10).times(NUMERIC_MULTIPLIER);

    if (LeafValueCoder.isSignedValue(label)) {
      return LeafValueCoder.encodeHex(LeafValueCoder.signedValueToHex(bn), bits);
    }

    return LeafValueCoder.encodeHex(bn.toString(16), bits);
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

    if (LeafValueCoder.isSignedValue(label)) {
      const signedInt = LeafValueCoder.toInt(bn);
      return signedInt.div(NUMERIC_MULTIPLIER).toNumber();
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

  static isSignedValue = (label: string): boolean => label.startsWith(SIGNED_NUMBER_PREFIX);

  private static fixedValueToHex = (n: FeedValue): string => {
    if (typeof n === 'number') {
      return n.toString(16);
    }

    return new BigNumber(n || '0', n.startsWith('0x') ? 16 : 10).toString(16);
  };

  static signedValueToHex = (n: BigNumber): string => {
    if (n.gte(0)) {
      return n.toString(16);
    }

    return MAX_UINT224_BN.plus(n).plus(1).toString(16);
  };

  static toInt = (n: BigNumber): BigNumber => {
    if (MAX_INT_224_BN.gte(n)) {
      return n;
    }

    return MIN_INT_224_BN.plus(n).minus(MAX_INT_224_BN).minus(1);
  };
}
