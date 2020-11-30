import {FLOATING_POINT_HEX} from '../constants';
import intToBuffer from './intToBuffer';

const MAX_SAFE_INTEGER_DIGIT_LENGTH = 16;

const appendFloatData = (data: Buffer, power: number): Buffer => {
  const maxFloatingDigits = parseInt(FLOATING_POINT_HEX, 16);

  if (power >= maxFloatingDigits) {
    throw Error(`Max supported number of floating digits is ${maxFloatingDigits - 1}`);
  }

  if (power >= MAX_SAFE_INTEGER_DIGIT_LENGTH) {
    throw Error(`Number overflow, Max supported number of digits for floating type is ${MAX_SAFE_INTEGER_DIGIT_LENGTH - 1}`);
  }

  return Buffer.concat([
    data, Buffer.from(FLOATING_POINT_HEX, 'hex'), intToBuffer(power)
  ]);
};

const extractFloatingPart = (f: number): [floatPart: string, power: number] => {
  const maxFloatPartLength = MAX_SAFE_INTEGER_DIGIT_LENGTH - Math.trunc(f).toString(10).length;
  let floatPart = '';

  if (f - Math.trunc(f) === 0) {
    return [floatPart, 0];
  }

  for (let i = 1;  i <= maxFloatPartLength; i++) {
    floatPart = `${floatPart}${(Math.trunc(f * Math.pow(10, i)) % 10).toString(10)}`;
  }

  floatPart = floatPart.replace(/0+$/g, '');
  return [floatPart, floatPart.length];
};

const floatToBuffer = (f: number): Buffer => {
  if (f === 0) {
    return appendFloatData(Buffer.from(''), 0);
  }

  const intPart = Math.trunc(f).toString(10);
  const [floatPart, power] = extractFloatingPart(f);

  if (floatPart === '') {
    return appendFloatData(intToBuffer(f), 0);
  }

  return appendFloatData(intToBuffer(parseInt(`${intPart}${floatPart}`, 10)), power);
};

export default floatToBuffer;
