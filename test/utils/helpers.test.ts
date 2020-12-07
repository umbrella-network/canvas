import {extractFromLeaf} from '../../src/utils/helpers';

import {expect} from 'chai';
import {LeafType} from '../../src';
import {LEAF_TYPE_SEPARATOR_HEX} from '../../src/constants';

describe('extractFromLeaf()', () => {
  describe('when leaf is invalid', () => {
    it('expect to return undefined type', () => {
      expect(extractFromLeaf('')).to.eql([null, undefined]);
      expect(extractFromLeaf('0')).to.eql([null, undefined]);
      expect(extractFromLeaf('0x0')).to.eql([null, undefined]);
      expect(extractFromLeaf('zzz')).to.eql([null, undefined]);
      expect(extractFromLeaf('0xf1')).to.eql([null, undefined]);
      expect(extractFromLeaf('')).to.eql([null, undefined]);
      expect(extractFromLeaf('0')).to.eql([null, undefined]);
      expect(extractFromLeaf('0x123f1')).to.eql([null, undefined]);
      expect(extractFromLeaf('0x02')).to.eql([null, undefined]);
    });

    describe('when leaf is valid', () => {
      it('expect to return valid data and type', () => {
        expect(extractFromLeaf(`0x${LEAF_TYPE_SEPARATOR_HEX}1`)).to.eql(['', LeafType.TYPE_HEX]);
        expect(extractFromLeaf(`${LEAF_TYPE_SEPARATOR_HEX}${LEAF_TYPE_SEPARATOR_HEX}02`)).to.eql(['ff', LeafType.TYPE_INTEGER]);
        expect(extractFromLeaf(`0x0FF${LEAF_TYPE_SEPARATOR_HEX}02`)).to.eql(['0FF', LeafType.TYPE_INTEGER]);
        expect(extractFromLeaf(`0x2${LEAF_TYPE_SEPARATOR_HEX}003`)).to.eql(['2', LeafType.TYPE_FLOAT]);
      });
    });
  });
});
