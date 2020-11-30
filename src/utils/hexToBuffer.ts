import {evenHex, isHex} from '../utils/helpers';

const hexToBuffer = (hex: string): Buffer => {
  if (!isHex(hex)) {
    throw Error(`${hex} is not valid hex value`);
  }

  return Buffer.from(evenHex(hex), 'hex');
};

export default hexToBuffer;
