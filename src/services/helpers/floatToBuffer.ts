import {FLOATING_POINT_HEX} from '../../constants';
import {intToBuffer} from './intToBuffer';

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

export const floatToBuffer = (floatNumber: number): Buffer => {
  if (floatNumber === 0) {
    return appendFloatData(Buffer.from(''), 0);
  }

  const floatString: string = floatNumber + '';
  const [intPart, floatPart] = floatString.split('.');

  if (!floatPart) {
    return appendFloatData(intToBuffer(floatNumber), 0);
  }

  return appendFloatData(intToBuffer(parseInt(`${intPart}${floatPart}`, 10)), floatPart.length);
};
