import { expect } from 'chai';
import { remove0x, prepend0x, evenHex, isTimestampMoreRecentThan } from '../../src/utils/helpers';

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

describe('isTimestampMoreRecentThan', () => {
  const timestamp = Math.floor(Date.now() / 1000);

  describe('when timestamp is not between the current date and the current date minus the limit', () => {
    it('returns false', () => {
      expect(isTimestampMoreRecentThan(timestamp - 120, 60)).to.be.false;
    });
  });

  describe('when timestamp is between the current date and the current date minus the limit', () => {
    it('returns true', () => {
      expect(isTimestampMoreRecentThan(timestamp - 50, 60)).to.be.true;
    });
  });
});
