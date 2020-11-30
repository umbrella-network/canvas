export default class LeafKeyCoder {
  /**
   *
   * @param key {string} Buffer
   */
  static encode(key: string): Buffer {
    return Buffer.from(key);
  }

  static decode(key: Buffer): string {
    return key.toString('utf-8');
  }
}

