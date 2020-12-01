import {LeafType} from '../models/LeafType';
import {evenHex, extractFromLeaf, leafTypeToBuffer, prepend0x} from '../utils/helpers';
import floatFromHex from '../utils/floatFromHex';
import hexToBuffer from '../utils/hexToBuffer';
import intToBuffer from '../utils/intToBuffer';
import floatToBuffer from '../utils/floatToBuffer';
import {LEAF_TYPE_SEPARATOR_HEX} from '../constants';

export default class LeafValueCoder {
  // eslint-disable-next-line
  static encode(data: any, type: LeafType): Buffer {
    switch (type) {
    case LeafType.TYPE_HEX:
      return LeafValueCoder.encoder(hexToBuffer(data), LeafType.TYPE_HEX);
    case LeafType.TYPE_INTEGER:
      return LeafValueCoder.encoder(intToBuffer(data), LeafType.TYPE_INTEGER);
    case LeafType.TYPE_FLOAT:
      return LeafValueCoder.encoder(floatToBuffer(data), LeafType.TYPE_FLOAT);
    default:
      throw Error(`data type: ${type} is not supported yet`);
    }
  }

  private static encoder(data: Buffer, type: LeafType): Buffer {
    return Buffer.concat([data, Buffer.from(LEAF_TYPE_SEPARATOR_HEX, 'hex'), leafTypeToBuffer(type)]);
  }
  /**
   *
   * @param leaf {string} data in hex format
   */
  static decode(leaf: string): string | number | undefined {
    const [data, type] = extractFromLeaf(leaf);

    switch (type) {
    case LeafType.TYPE_HEX:
      return prepend0x(evenHex(data ? data : '0'));
    case LeafType.TYPE_INTEGER:
      return data ? parseInt(data, 16) : 0;
    case LeafType.TYPE_FLOAT:
      return data ? floatFromHex(data) : 0;
    }

    return undefined;
  }
}
