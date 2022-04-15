import { expect } from 'chai';
import { remove0x, prepend0x, evenHex, isTimestampMoreRecentThan, formatWeiToGwei } from '../../src/utils/helpers';

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
  describe('when timestamp is not between the current date and the current date minus the limit', () => {
    it('returns false', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      expect(isTimestampMoreRecentThan(timestamp - 120, 60)).to.be.false;
    });
  });

  describe('when timestamp is between the current date and the current date minus the limit', () => {
    it('returns true', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      expect(isTimestampMoreRecentThan(timestamp - 50, 60)).to.be.true;
    });
  });
});

describe('.formatWeiToGwei', () => {
  describe('when wei is lesser than 100000 (1e5)', () => {
    it('returns zero', () => {
      expect(formatWeiToGwei(1)).to.equal(0);
      expect(formatWeiToGwei(1e1)).to.equal(0);
      expect(formatWeiToGwei(1e2)).to.equal(0);
      expect(formatWeiToGwei(1e3)).to.equal(0);
      expect(formatWeiToGwei(1e4)).to.equal(0);
    });
  });

  describe('when wei is equal or greater than 100000 (1e5)', () => {
    it('successfully converts wei to gwei', () => {
      expect(formatWeiToGwei(1e5)).to.equal(0.0001);
      expect(formatWeiToGwei(1e6)).to.equal(0.001);
      expect(formatWeiToGwei(1e7)).to.equal(0.01);
      expect(formatWeiToGwei(1e8)).to.equal(0.1);
      expect(formatWeiToGwei(1e9)).to.equal(1);
      expect(formatWeiToGwei(1e10)).to.equal(10);
    });

    it('formats to at most 4 decimal cases', () => {
      expect(formatWeiToGwei(16150000)).to.equal(0.0162);
      expect(formatWeiToGwei(123_123_123_132)).to.equal(123.1231);
      expect(formatWeiToGwei(100000)).to.equal(0.0001);
    });

    it('rounds number corretly', () => {
      expect(formatWeiToGwei(10150000)).to.equal(0.0102);
      expect(formatWeiToGwei(10140000)).to.equal(0.0101);
    });
  });
});
