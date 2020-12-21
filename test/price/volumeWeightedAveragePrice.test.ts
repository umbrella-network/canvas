import {expect} from 'chai';

import type {BarPrice} from '../../src/price/types';
import {volumeWeightedAveragePrice} from '../../src/price';

describe('volumeWeightedAveragePrice()', () => {
  const dataToTest: [[BarPrice, number][], number][] = [
    [[[{open: 14.4, close: 16.5, low: 12, high: 18}, 1000]], 15.5],
  ];

  dataToTest.forEach(arr => {
    const [values, expected] = arr;

    it(`expect volumeWeightedAveragePrice of ${JSON.stringify(values)} to be equal to ${expected}`, () => {
      expect(volumeWeightedAveragePrice(values)).to.eq(expected);
    });
  });

  const [bars, expected]: [[BarPrice, number][], number] = [[
    [{close: 244.8702, open: 245.2903, high: 245.516, low: 244.7652}, 103033],
    [{close: 244.66, open: 245.0807, high: 245.0807, low: 244.55}, 21168],
    [{close: 245.6, open: 244.58, high: 245.8, low: 244.55}, 36544],
    [{close: 245.92, open: 245.7097, high: 246.09, low: 245.57}, 30057],
    [{close: 245.62, open: 245.62, high: 245.62, low: 245.62}, 26301],
    [{close: 246.188, open: 245.7126, high: 246.44, low: 245.7126}, 31494],
    [{close: 246.45, open: 246.46, high: 246.46, low: 246.45}, 24271],
    [{close: 246.25, open: 246.755, high: 246.755, low: 246.25}, 37951],
    [{close: 246.655, open: 246.2818, high: 246.655, low: 246.2818}, 15324],
    [{close: 246.762, open: 246.78, high: 246.78, low: 246.56}, 23285],
    [{close: 246.5, open: 246.75, high: 246.75, low: 246.38}, 23365],
    [{close: 246.17, open: 246.17, high: 246.17, low: 246.17}, 16130],
    [{close: 245.82, open: 246.135, high: 246.135, low: 245.82}, 27227],
    [{close: 245.91, open: 245.9335, high: 245.9335, low: 245.91}, 14464],
    [{close: 246.41, open: 246.41, high: 246.41, low: 246.41}, 17156],
    [{close: 246.1683, open: 246.44, high: 246.46, low: 246.1683}, 23938],
    [{close: 246.57, open: 246.2857, high: 246.57, low: 246.2857}, 70833],
    [{close: 247.47, open: 246.6, high: 247.47, low: 246.6}, 59743],
    [{close: 247.65, open: 247.49, high: 247.65, low: 247.49}, 71995],
    [{close: 247.69, open: 247.685, high: 247.801, low: 247.65}, 46038],
    [{close: 248.74, open: 247.95, high: 248.74, low: 247.95}, 103773],
    [{close: 247.95, open: 248.56, high: 248.56, low: 247.95}, 73810],
    [{close: 247.6614, open: 247.93, high: 247.93, low: 247.6614}, 29784],
    [{close: 247.76, open: 247.74, high: 247.76, low: 247.65}, 37138],
    [{close: 248.03, open: 247.93, high: 248.03, low: 247.93}, 53166],
    [{close: 248.44, open: 247.91, high: 248.44, low: 247.91}, 40789],
    [{close: 248.3154, open: 248.52, high: 248.52, low: 248.3154}, 51988],
    [{close: 248.62, open: 248.4409, high: 248.62, low: 248.4409}, 53405],
    [{close: 248.9199, open: 248.9199, high: 248.9199, low: 248.9199}, 85348],
    [{close: 248.72, open: 248.91, high: 249.08, low: 248.42}, 58270]], 247.24];

  it(`expect volumeWeightedAveragePrice of ${bars.length} bars to be equal to ${expected}`, () => {
    expect(volumeWeightedAveragePrice(bars).toFixed(2)).to.eq(expected.toString());
  });
});

