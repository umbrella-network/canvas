import {evenHex} from '../../utils/helpers';

export const intToBuffer = (i: number): Buffer => {
  return Buffer.from(evenHex(Math.trunc(i).toString(16)), 'hex');
};
