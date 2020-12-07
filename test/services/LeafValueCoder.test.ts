import {expect} from 'chai';
import {LeafValueCoder} from "../../src";
import {LeafType} from "../../src";
import {leafTypeToHex} from "../../src/utils/helpers";
import {FLOATING_POINT_HEX, LEAF_TYPE_SEPARATOR_HEX} from "../../src/constants";

describe('LeafValueCoder', () => {
  describe('.encode()', () => {
    it('expect to encode hex data', () => {
      expect(LeafValueCoder.encode('0', LeafType.TYPE_HEX))
        .to.eql(Buffer.from(`${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_HEX)}`, 'hex'));

      expect(LeafValueCoder.encode('01A', LeafType.TYPE_HEX))
        .to.eql(Buffer.from(`1a${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_HEX)}`, 'hex'));
    });

    it('expect to encode int data', () => {
      expect(LeafValueCoder.encode(0, LeafType.TYPE_INTEGER))
        .to.eql(Buffer.from(`${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_INTEGER)}`, 'hex'));

      expect(LeafValueCoder.encode(255, LeafType.TYPE_INTEGER))
        .to.eql(Buffer.from(`ff${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_INTEGER)}`, 'hex'));
    });

    it('expect to encode float data', () => {
      expect(LeafValueCoder.encode(0.0, LeafType.TYPE_FLOAT))
        .to.eql(Buffer.from(`${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_FLOAT)}`, 'hex'));

      expect(LeafValueCoder.encode(255, LeafType.TYPE_FLOAT))
        .to.eql(Buffer.from(`ff${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_FLOAT)}`, 'hex'));

      expect(LeafValueCoder.encode(255.00255, LeafType.TYPE_FLOAT))
        .to.eql(Buffer.from(`01851a5f${FLOATING_POINT_HEX}05${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_FLOAT)}`, 'hex'));
    });
  })

  describe('.decode()', () => {
    it('expect to return undefined for non supported data', () => {
      expect(LeafValueCoder.decode('')).to.eq(undefined);
      expect(LeafValueCoder.decode('0')).to.eq(undefined)
      expect(LeafValueCoder.decode('0x0')).to.eq(undefined)
      expect(LeafValueCoder.decode('0x2')).to.eq(undefined)
      expect(LeafValueCoder.decode('xxx')).to.eq(undefined)
    });

    it('expect to return undefined for invalid float data', () => {
      const type = leafTypeToHex(LeafType.TYPE_FLOAT)
      expect(LeafValueCoder.decode(`0${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(undefined)
    });

    it('expect to decode hex data', () => {
      const type = leafTypeToHex(LeafType.TYPE_HEX)
      expect(LeafValueCoder.decode(`0x000${LEAF_TYPE_SEPARATOR_HEX}1`)).to.eq('0x0');
      expect(LeafValueCoder.decode(`01A${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq('0x1A')
    });

    it('expect to encode int data', () => {
      const type = leafTypeToHex(LeafType.TYPE_INTEGER)
      expect(LeafValueCoder.decode(`${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(LeafValueCoder.decode(`0${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(LeafValueCoder.decode(`FF${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(255);
    });

    it('expect to encode float data', () => {
      const type = leafTypeToHex(LeafType.TYPE_FLOAT)
      expect(LeafValueCoder.decode(`${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(LeafValueCoder.decode(`${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(LeafValueCoder.decode(`0${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(LeafValueCoder.decode(`00${FLOATING_POINT_HEX}${LEAF_TYPE_SEPARATOR_HEX}${type}`)).to.eq(0);
      expect(LeafValueCoder.decode(`01851a5f${FLOATING_POINT_HEX}05${LEAF_TYPE_SEPARATOR_HEX}${leafTypeToHex(LeafType.TYPE_FLOAT)}`)).to.eq(255.00255);
    });
  });
});
