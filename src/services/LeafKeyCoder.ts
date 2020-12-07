import {remove0x} from '../utils/helpers';

export class LeafKeyCoder {
  static encode(key: string): Buffer {
    return Buffer.from(key);
  }

  static decode(key: Buffer | string): string {
    return (typeof key === 'string' ? Buffer.from(remove0x(key), 'hex') : key).toString('utf-8');
  }
}

