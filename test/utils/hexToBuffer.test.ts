import {expectThrows} from '../helpers';

import {hexToBuffer} from '../../src/utils/hexToBuffer';

import {expect} from 'chai';

describe('hexToBuffer()', () => {
  it('expect to throw on non hex values', () => {
    expectThrows(() => hexToBuffer(''), '');
    expectThrows(() => hexToBuffer('0xx'), '');
  });

  it('expect to convert hex string', () => {
    expect(hexToBuffer('0')).to.eql(Buffer.from(''));
    expect(hexToBuffer('0x0')).to.eql(Buffer.from(''));
    expect(hexToBuffer('0xf')).to.eql(Buffer.from('0f', 'hex'));
    expect(hexToBuffer('0x0f')).to.eql(Buffer.from('0f', 'hex'));
    expect(hexToBuffer('0x010')).to.eql(Buffer.from('10', 'hex'));
  });
});
