import {BigNumber} from 'bignumber.js';

export const numberToUint256 = (n: number): string => {
  if (n === 0) {
    return '0x0';
  }

  const decimals = 18;
  const floatString: string = n + '';
  const [intPart, floatPart] = floatString.split('.');

  const digits = new BigNumber(10, 10).pow(decimals);
  const i = new BigNumber(intPart, 10).multipliedBy(digits);

  if (!floatPart) {
    return '0x' + i.toString(16);
  }

  const floatPartSliced = floatPart.slice(0, decimals);
  const floatPower = new BigNumber(10, 10).pow(decimals - floatPartSliced.length);
  const f = new BigNumber(floatPartSliced, 10).multipliedBy(floatPower);

  return '0x' + i.plus(f).toString(16);
};
