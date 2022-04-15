import { utils } from 'ethers';

export const remove0x = (v: string): string => (['0X', '0x'].includes(v.slice(0, 2)) ? v.slice(2) : v);

export const prepend0x = (v: string): string => (['0X', '0x'].includes(v.slice(0, 2)) ? v : `0x${v ? v : '0'}`);

export const evenHex = (v: string): string => {
  if (!utils.isHexString(prepend0x(v))) {
    throw Error(`${v} is not valid hex value`);
  }

  const hex = remove0x(v).replace(/^0+/g, '');
  return `${hex.length % 2 === 0 ? '' : '0'}${hex}`;
};

export const isTimestampMoreRecentThan = (timestamp: number, limit: number): boolean => {
  const currentDate = Math.floor(Date.now() / 1000);
  return timestamp <= currentDate && timestamp >= currentDate - limit;
};

export const formatWeiToGwei = (wei: number): number => {
  const amountInGwei = wei / 1e9;
  const roundedGwei = Math.round(amountInGwei * 1e4) / 1e4;
  return roundedGwei;
};
