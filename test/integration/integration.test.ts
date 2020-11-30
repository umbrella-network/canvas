import {expect} from 'chai';
import {LeafValueCoder} from "../../src/";
import {LeafType} from "../../src/models/LeafType";

describe('floating point numbers', () => {
  it('expect to encode and decode leaf value', () => {
    const f: number = 1234.0000987
    const leaf = LeafValueCoder.encode(f, LeafType.TYPE_FLOAT).toString('hex');
    expect(LeafValueCoder.decode(leaf)).to.eq(f)
  });
});
