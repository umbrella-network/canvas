import {expect} from 'chai';

import type {BarPrice} from '../../src/price/types';
import {TWAPMean} from '../../src/price';

describe('TWAPMean()', () => {
  const dataToTest: [BarPrice[], number][] = [
    [[{open: 14.4, close: 16.5, low: 12, high: 18}], 15.225],
    [[{open: 14.4, close: 16.5, low: 12, high: 18}, {open: 14.4, close: 16.5, low: 12, high: 18}], 15.225],
    [[{open: 10.0, close: 18.0, low: 4.0, high: 19.0}, {open: 14.4, close: 16.5, low: 12, high: 18}], 13.9875],
  ];

  dataToTest.forEach(arr => {
    const [values, expected] = arr;

    it(`expect TWAPMean of ${JSON.stringify(values)} to be equal to ${expected}`, () => {
      expect(TWAPMean(values)).to.eq(expected);
    });
  });

  const [bars, expected]: [BarPrice[], number] = [[
    {close: 351.59, open: 355.15, high: 355.40, low: 351.09},
    {close: 352.08, open: 351.46, high: 353.20, low: 344.72},
    {close: 342.99, open: 333.25, high: 345.68, low: 332.58},
    {close: 338.80, open: 344.72, high: 347.80, low: 334.22},
    {close: 335.90, open: 349.31, high: 351.06, low: 335.48},
    {close: 352.84, open: 347.90, high: 354.77, low: 346.09},
    {close: 343.99, open: 332.14, high: 345.61, low: 332.01},
    {close: 333.46, open: 330.25, high: 333.60, low: 327.32},
    {close: 331.50, open: 323.35, high: 331.75, low: 323.23},
    {close: 322.32, open: 324.39, high: 325.62, low: 320.78},
    {close: 325.12, open: 324.66, high: 326.20, low: 322.30},
    {close: 323.34, open: 320.75, high: 323.44, low: 318.93},
    {close: 321.85, open: 317.75, high: 322.35, low: 317.21},
    {close: 317.94, open: 319.25, high: 321.15, low: 316.47},
    {close: 318.25, open: 316.77, high: 323.44, low: 315.63},
    {close: 318.11, open: 316.14, high: 318.71, low: 313.09},
    {close: 316.73, open: 323.50, high: 324.24, low: 316.50},
    {close: 318.89, open: 315.77, high: 319.23, low: 315.35},
    {close: 316.85, open: 318.66, high: 320.89, low: 315.87},
    {close: 319.23, open: 316.68, high: 319.52, low: 316.20},
    {close: 313.14, open: 315.03, high: 318.52, low: 313.01},
    {close: 314.96, open: 313.17, high: 316.50, low: 310.32}], 328.15];

  it(`expect TWAPMean of ${bars.length} bars to be equal to ${expected}`, () => {
    expect(TWAPMean(bars).toFixed(2)).to.eq(expected.toString());
  });
});

