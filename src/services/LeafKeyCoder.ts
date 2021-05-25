import { evenHex, remove0x } from '../utils/helpers';

export class LeafKeyCoder {
  static encode = (key: string): Buffer => {
    const bytes = 32;
    const buff32 = Buffer.alloc(bytes).fill(0);
    const value = Buffer.from(key);

    if (value.length > 32) {
      throw Error(`key overflow: got ${value.length} bytes`);
    }

    value.copy(buff32, bytes - value.length);
    return buff32;
  };

  static decode(key: Buffer | string): string {
    return (typeof key === 'string' ? Buffer.from(evenHex(remove0x(key)), 'hex') : key).toString('utf-8');
  }
}
