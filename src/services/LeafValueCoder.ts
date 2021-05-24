import { NUMERIC_MULTIPLIER } from '../constants';
import { BigNumber } from 'bignumber.js';
import { utils } from 'ethers';
import { evenHex, prepend0x } from '../utils/helpers';

export class LeafValueCoder {
  static encode = (n: number, bits = 256): Buffer =>
    LeafValueCoder.encodeHex(new BigNumber(n).times(NUMERIC_MULTIPLIER).toString(16), bits);

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
   */
  static decode = (leafAsHex: string): number => new BigNumber(leafAsHex, 16).div(NUMERIC_MULTIPLIER).toNumber();
}
