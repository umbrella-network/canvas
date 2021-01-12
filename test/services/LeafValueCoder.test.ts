import {expect} from 'chai';
import * as SDK from '../../src';
import {leafTypeToHex} from '../../src/utils/helpers';
import {FLOATING_POINT_HEX, LEAF_TYPE_SEPARATOR_HEX} from '../../src/constants';

describe('LeafValueCoder', () => {
  describe('.encode()', () => {
    it('expect to encode hex data', () => {
      expect(SDK.coders.LeafValueCoder.encode('0', SDK.types.LeafType.TYPE_HEX))
        .to.eql(Buffer.from(`${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_HEX)}`, 'hex'));

      expect(SDK.coders.LeafValueCoder.encode('01A', SDK.types.LeafType.TYPE_HEX))
        .to.eql(Buffer.from(`1a${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_HEX)}`, 'hex'));
    });

    it('expect to encode int data', () => {
      expect(SDK.coders.LeafValueCoder.encode(0, SDK.types.LeafType.TYPE_INTEGER))
        .to.eql(Buffer.from(`${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_INTEGER)}`, 'hex'));

      expect(SDK.coders.LeafValueCoder.encode(255, SDK.types.LeafType.TYPE_INTEGER))
        .to.eql(Buffer.from(`ff${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_INTEGER)}`, 'hex'));
    });

    it('expect to encode float data', () => {
      expect(SDK.coders.LeafValueCoder.encode(0.0, SDK.types.LeafType.TYPE_FLOAT))
        .to.eql(Buffer.from(`${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_FLOAT)}`, 'hex'));

      expect(SDK.coders.LeafValueCoder.encode(255, SDK.types.LeafType.TYPE_FLOAT))
        .to.eql(Buffer.from(`ff${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_FLOAT)}`, 'hex'));

      expect(SDK.coders.LeafValueCoder.encode(255.00255, SDK.types.LeafType.TYPE_FLOAT))
        .to.eql(Buffer.from(`01851a5f${FLOATING_POINT_HEX}05${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_FLOAT)}`, 'hex'));
    });
  });

  describe('.decode()', () => {
    it('expect to return undefined for non supported data', () => {
      expect(SDK.coders.LeafValueCoder.decode('')).to.eq(undefined);
      expect(SDK.coders.LeafValueCoder.decode('0')).to.eq(undefined);
      expect(SDK.coders.LeafValueCoder.decode('0x0')).to.eq(undefined);
      expect(SDK.coders.LeafValueCoder.decode('0x2')).to.eq(undefined);
      expect(SDK.coders.LeafValueCoder.decode('xxx')).to.eq(undefined);
    });

    it('expect to return undefined for invalid float data', () => {
      const type = leafTypeToHex(SDK.types.LeafType.TYPE_FLOAT);
      expect(SDK.coders.LeafValueCoder.decode(`0${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(undefined);
    });

    it('expect to decode hex data', () => {
      const type = leafTypeToHex(SDK.types.LeafType.TYPE_HEX);
      expect(SDK.coders.LeafValueCoder.decode(`0x000${LEAF_TYPE_SEPARATOR_HEX}1`)).to.eq('0x0');
      expect(SDK.coders.LeafValueCoder.decode(`01A${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq('0x1A');
    });

    it('expect to encode int data', () => {
      const type = leafTypeToHex(SDK.types.LeafType.TYPE_INTEGER);
      expect(SDK.coders.LeafValueCoder.decode(`${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(SDK.coders.LeafValueCoder.decode(`0${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(SDK.coders.LeafValueCoder.decode(`FF${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(255);
    });

    it('expect to encode float data', () => {
      const type = leafTypeToHex(SDK.types.LeafType.TYPE_FLOAT);
      expect(SDK.coders.LeafValueCoder.decode(`${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(SDK.coders.LeafValueCoder.decode(`${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(SDK.coders.LeafValueCoder.decode(`0${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(SDK.coders.LeafValueCoder.decode(`00${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(SDK.coders.LeafValueCoder.decode(`01851a5f${FLOATING_POINT_HEX}05${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(SDK.types.LeafType.TYPE_FLOAT)}`)).to.eq(255.00255);
    });
  });
});
