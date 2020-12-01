import {FLOATING_POINT_HEX} from '../constants';
import { isEmpty } from './helpers';

const floatFromHex = (hex: string): number | undefined => {
  if (isEmpty(hex)) {
    return 0;
  }

  const floatingPointDividerIndex = hex.toLowerCase().lastIndexOf(FLOATING_POINT_HEX);

  if (floatingPointDividerIndex < 0) {
    return undefined;
  }

  if (floatingPointDividerIndex === 0) {
    return 0;
  }

  const powerPart = hex.slice(floatingPointDividerIndex + FLOATING_POINT_HEX.length);
  const dataPart = hex.slice(0, floatingPointDividerIndex);

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
};

export default floatFromHex;
