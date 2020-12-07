import {evenHex, isHex} from './helpers';

export const hexToBuffer = (hex: string): Buffer => {
  if (!isHex(hex)) {
    throw Error(`${hex} is not valid hex value`);
  }

  return Buffer.from(evenHex(hex), 'hex');
};
