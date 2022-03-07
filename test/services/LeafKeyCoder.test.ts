import { expect } from 'chai';
import { ethers } from 'ethers';
import { LeafKeyCoder } from '../../src';

describe('KeyCoder()', () => {
  it('expect to encode key', () => {
    expect(LeafKeyCoder.encode('0').toString('hex')).to.eql('30'.padStart(64, '0'));
    expect(LeafKeyCoder.encode('01').toString('hex')).to.eql('3031'.padStart(64, '0'));
    expect(LeafKeyCoder.encode('Chain').toString('hex')).to.eql('436861696e'.padStart(64, '0'));
    expect(LeafKeyCoder.encode('ETH-USD').toString('hex')).to.eql('4554482d555344'.padStart(64, '0'));
  });

  it('expect to throw on overflow', () => {
    expect(() => {
      LeafKeyCoder.encode('123456789012345678901234567890123');
    }).to.throw;
  });

  it('expect to encode 32 characters in a key', () => {
    const encoded = LeafKeyCoder.encode('12345678901234567890123456789012').toString('hex');
    expect(encoded.length).to.eql(ethers.constants.HashZero.length - 2);
    expect(encoded).to.eql('3132333435363738393031323334353637383930313233343536373839303132');
  });

  it('expect to encode 10 Chinese characters in a key', () => {
    const encoded = LeafKeyCoder.encode('區塊鏈統治著傘狀岩石').toString('hex');
    expect(encoded.length).to.lte(ethers.constants.HashZero.length - 2);
    expect(encoded).to.eql('e58d80e5a18ae98f88e7b5b1e6b2bbe89197e58298e78b80e5b2a9e79fb3'.padStart(64, '0'));
  });

  it('expect to decode key', () => {
    expect(LeafKeyCoder.decode(Buffer.from('30', 'hex'))).to.eql('0');
    expect(LeafKeyCoder.decode(Buffer.from('3031', 'hex'))).to.eql('01');
    expect(LeafKeyCoder.decode('3031')).to.eql('01');
    expect(LeafKeyCoder.decode('0x3031')).to.eql('01');
    expect(LeafKeyCoder.decode('4554482d555344')).to.eql('ETH-USD');
    expect(LeafKeyCoder.decode('0x4554482d555344')).to.eql('ETH-USD');
  });

  const options = [
    'ETH-26NOV21-3500',
    'BTC-26NOV21-66000'
  ];

  const optionsSuffix = [
    'call_price',
    'put_price',
    'iv',
    'gamma',
    'call_delta',
    'put_delta',
  ];

  options.forEach((base) => {
    optionsSuffix.forEach((suffix) => {
      it(`expect to encode and decode options key label for ${base}`, () => {
        const key = 'SN_' + base + '_' + suffix;
        const encoded = LeafKeyCoder.encode(key).toString('hex');
        expect(LeafKeyCoder.decode(encoded)).to.eql(key);
      });
    });
  });
});
