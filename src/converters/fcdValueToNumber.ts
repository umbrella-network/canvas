import {ethers} from 'ethers';

export const fcdValueToNumber = (value: ethers.BigNumber): number => {
  if (value.eq(0)) {
    return 0;
  }

  const fcdPrecision = 18;
  const str = value.toString();
  const floatingPoint = str.length - fcdPrecision;

  if (str.length < 18) {
    return parseFloat(`0.${str.padStart(fcdPrecision, '0')}`);
  }

  return parseFloat(`${str.slice(0, floatingPoint)}.${str.slice(floatingPoint)}`);
};
