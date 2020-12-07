import {LeafType} from '../../src';

import { expect } from 'chai';
import {LEAF_TYPE_SEPARATOR_HEX} from '../../src/constants';

describe('LeafType', () => {
  it('types indexes should never change' , () => {
    expect(LeafType.TYPE_HEX).to.equal(1);
    expect(LeafType.TYPE_INTEGER).to.equal(2);
    expect(LeafType.TYPE_FLOAT).to.equal(3);
  });

  it('expect not ot overflow number of supporting types' , () => {
    expect(Object.keys(LeafType).length /2).to.lt(parseInt(LEAF_TYPE_SEPARATOR_HEX, 16));
  });
});
