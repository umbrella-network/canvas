import {expect} from 'chai';
import LeafKeyCoder from "../../src/services/LeafKeyCoder";

describe('KeyCoder()', () => {
  it('expect to encode key', () => {
    expect(LeafKeyCoder.encode('0').toString('hex')).to.eql('30');
    expect(LeafKeyCoder.encode('01').toString('hex')).to.eql('3031');
  });

  it('expect to decode key', () => {
    expect(LeafKeyCoder.decode(Buffer.from('30', 'hex'))).to.eql('0');
    expect(LeafKeyCoder.decode(Buffer.from('3031', 'hex'))).to.eql('01');
    expect(LeafKeyCoder.decode('3031')).to.eql('01');
    expect(LeafKeyCoder.decode('0x3031')).to.eql('01');
  });
});
