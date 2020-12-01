import floatToBuffer from '../../src/utils/floatToBuffer';

import {expect} from 'chai';
import {FLOATING_POINT_HEX} from "../../src/constants";

describe('floatToBuffer()', () => {
  const numbers: [number, string][] = [
    [0, FLOATING_POINT_HEX],
    [1, `01${FLOATING_POINT_HEX}`],
    [238, `${FLOATING_POINT_HEX}${FLOATING_POINT_HEX}`],
    [1.1, `0b${FLOATING_POINT_HEX}01`],
    [0.8359, `20a7${FLOATING_POINT_HEX}04`],
    [73.74, `1cc${FLOATING_POINT_HEX}e02`],
    [1.56, `9c${FLOATING_POINT_HEX}02`],
    [0.94, `5e${FLOATING_POINT_HEX}02`],
    [590.39, `e69f${FLOATING_POINT_HEX}02`],
    [255.0000000000017, `090f36242d6011${FLOATING_POINT_HEX}0d`]
  ]

  for (let i in numbers) {
    it(`expect to encode number ${numbers[i][0]}`, () => {
      expect(floatToBuffer(numbers[i][0]).toString('hex')).to.eq(numbers[i][1])
    })
  }
});
