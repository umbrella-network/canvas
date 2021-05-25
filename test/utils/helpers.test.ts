import { expect } from 'chai';
import { remove0x } from '../../src/utils/helpers';
import { prepend0x } from '../../src/utils/helpers';
import { evenHex } from '../../src/utils/helpers';

it('remove0x', () => {
  expect(remove0x('')).to.eql('');
  expect(remove0x('a')).to.eql('a');
  expect(remove0x('0x')).to.eql('');
});

it('prepend0x', () => {
  expect(prepend0x('')).to.eql('0x0');
  expect(prepend0x('a')).to.eql('0xa');
  expect(prepend0x('0x')).to.eql('0x');
});

it('evenHex', () => {
  expect(evenHex('')).to.eql('');
  expect(evenHex('a')).to.eql('0a');
  expect(evenHex('0x')).to.eql('');
});
