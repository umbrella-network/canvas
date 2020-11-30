import {FLOATING_POINT_HEX} from '../constants';
import { isEmpty } from './helpers';

const floatFromHex = (hex: string): number | undefined => {
  if (isEmpty(hex)) {
    return 0;
  }

  const parts = hex.toLowerCase().split(FLOATING_POINT_HEX);

  if (parts.length === 0) {
    return 0;
  }
  if (parts.length === 1) {
    return undefined;
  }

  const powerPart = parts.pop();
  const dataPart = parts.join(FLOATING_POINT_HEX);

  if (!powerPart && !dataPart) {
    return 0;
  } else if (!powerPart) {
    return parseInt(dataPart, 16);
  }

  const numberAsString = parseInt(dataPart, 16).toString(10);

  const power = parseInt(powerPart, 16);
  const intPart = numberAsString.slice(0, numberAsString.length - power);
  const floatPart = numberAsString.slice(-power);

  return parseFloat(`${intPart}.${floatPart}`);
  //return data * Math.pow(10, -power);
};

export default floatFromHex;
