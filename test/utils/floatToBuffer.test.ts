import floatToBuffer from '../../src/utils/floatToBuffer';

import {expect} from 'chai';
import {FLOATING_POINT_HEX} from "../../src/constants";

describe('floatToBuffer()', () => {
  it('expect to convert floating point numbers', () => {
    expect(floatToBuffer(0)).to.eql(Buffer.from(FLOATING_POINT_HEX, 'hex'));
    expect(floatToBuffer(0.0)).to.eql(Buffer.from(FLOATING_POINT_HEX, 'hex'));
    expect(floatToBuffer(1)).to.eql(Buffer.concat([Buffer.from('01', 'hex'), Buffer.from(FLOATING_POINT_HEX, 'hex')]));
    expect(floatToBuffer(0.1)).to.eql(Buffer.concat([Buffer.from('01', 'hex'), Buffer.from(FLOATING_POINT_HEX, 'hex'), Buffer.from('01', 'hex')]));

    expect(floatToBuffer(1.1)).to.eql(Buffer.concat([
      Buffer.from('0b', 'hex'), Buffer.from(FLOATING_POINT_HEX, 'hex'), Buffer.from('01', 'hex')
    ]));

    expect(floatToBuffer(255.0000000000017)).to.eql(Buffer.concat([
      Buffer.from('090f36242d6011', 'hex'),
      Buffer.from(FLOATING_POINT_HEX, 'hex'),
      Buffer.from('0d', 'hex'),
    ]));
  });
});
