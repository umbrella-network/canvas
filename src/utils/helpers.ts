import {LeafType} from '..';
import {LEAF_TYPE_SEPARATOR_HEX} from '../constants';

// eslint-disable-next-line
export const isNotSet = (v: any): boolean => {
  // eslint-disable-next-line valid-typeof
  return v === null || typeof v === 'undefined' || typeof v === undefined;
};

export const remove0x = (v: string): string => ['0X', '0x'].includes(v.slice(0, 2)) ? v.slice(2) : v;

export const prepend0x = (v: string): string => ['0X', '0x'].includes(v.slice(0, 2)) ? v : `0x${v ? v : '0'}`;

export const evenHex = (v: string): string => {
  if (!isHex(v)) {
    throw Error(`${v} is not valid hex value`);
  }

  const hex = remove0x(v).replace(/^0+/g, '');
  return `${hex.length % 2 === 0 ? '' : '0'}${hex}`;
};

export const isHex = (v: string): boolean => {
  if (!v) {
    return false;
  }

  const no0x = remove0x(v);

  for (let i = 0; i < no0x.length; i++) {
    if (isNaN(parseInt(no0x.charAt(i), 16))) {
      return false;
    }
  }

  return true;
};

export const leafTypeToHex = (type: LeafType): string => evenHex(type.toString(16));

export const leafTypeToBuffer = (type: LeafType): Buffer => Buffer.from(leafTypeToHex(type), 'hex');

/**
 *
 * @param hexData
 * @return [string | null, LeafType | undefined] [raw data, type]
 */
export const extractFromLeaf = (hexData: string): [data: string | null, type: LeafType | undefined] => {
  if (!hexData) {
    return [null, undefined];
  }

  const dividerIndex = hexData.toLowerCase().lastIndexOf(LEAF_TYPE_SEPARATOR_HEX);

  if (dividerIndex < 0) {
    return [null, undefined];
  }

  const detectedType: number = parseInt(hexData.slice(dividerIndex + LEAF_TYPE_SEPARATOR_HEX.length), 16);
  const data: string = hexData.slice(0, dividerIndex);

  return LeafType[detectedType] ? [remove0x(data), detectedType] : [null, undefined];
};
