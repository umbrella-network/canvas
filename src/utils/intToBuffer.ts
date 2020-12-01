import int64 from 'int64-buffer';
import {evenHex} from './helpers';

const intToBuffer = (i: number): Buffer => {
  return Buffer.from(evenHex(Math.trunc(i).toString(16)), 'hex');

  const hex = new int64.Int64BE(i).toBuffer().toString('hex');
  const hexInt = hex.replace(/^0+/g, '');
  return Buffer.from(`${hexInt.length % 2 === 0 ? '' : '0'}${hexInt}`, 'hex');
};

export default intToBuffer;
