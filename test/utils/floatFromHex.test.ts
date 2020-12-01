import floatFromHex from '../../src/utils/floatFromHex';

import {expect} from 'chai';

describe('floatFromHex()', () => {
  const numbers: [number, string][] = [
    [0, 'ee'],
    [0, '0ee'],
    [0, '00ee'],
    [1.1, '0bee01'],
    [0.8359, '20a7ee04'],
    [73.74, '1cceee02'],
    [1.56, '9cee02'],
    [0.94, '5eee02'],
    [590.39, 'e69fee02'],
    [255.0000000000017, '090f36242d6011ee0d']
  ]

  for (let i in numbers) {
    it(`expect to encode number ${numbers[i][0]}`, () => {
      expect(floatFromHex(numbers[i][1])).to.eq(numbers[i][0])
    })
  }
});
