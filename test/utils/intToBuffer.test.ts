import intToBuffer from '../../src/utils/intToBuffer';

import {expect} from 'chai';

describe('intToBuffer()', () => {
  it('expect to convert int', () => {
    expect(intToBuffer(0)).to.eql(Buffer.from(''));
    expect(intToBuffer(1)).to.eql(Buffer.from('01', 'hex'));
    expect(intToBuffer(255)).to.eql(Buffer.from('FF', 'hex'));
  });
});
