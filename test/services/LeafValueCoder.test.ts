import { expect } from 'chai';
import { ethers } from 'ethers';
import { LeafValueCoder } from '../../src';

describe('LeafValueCoder', () => {
  describe('.encode()', () => {
    it('expect to encode hex data', () => {
      expect(LeafValueCoder.encodeHex('0')).to.eql(Buffer.from('0'.repeat(64), 'hex'));
      expect(LeafValueCoder.encodeHex('01A')).to.eql(Buffer.from('1a'.padStart(64, '0'), 'hex'));
    });

    describe('number to Uint256', () => {
      const dataToTest: [number, string][] = [
        [0, ''],
        [1e-18, '1'],
        [1, '0de0b6b3a7640000'],
        [10, '0000000000000000000000000000000000000000000000008ac7230489e80000'],
        [10.01, '0000000000000000000000000000000000000000000000008aeaa9f6f9a90000'],
        [255, '0dd2d5fcf3bc9c0000'],
        [255, '0dd2d5fcf3bc9c0000'],
        [255.00255, '0dd2df0c29e0c96000'],
        [9007199254740991, '01bc16d674ec7ff21f494c589c0000'],
        [900719925474099.1, '2c68af0bb13ffe9cba87a2760000'],
        [1.900719925474099, '1a60b6b3a763ff38'],
      ];

      dataToTest.forEach((arr) => {
        const [toConvert, expected] = arr;

        it(`expect to convert ${toConvert} to solidity uint256`, () => {
          const encoded = LeafValueCoder.encode(toConvert).toString('hex');
          expect(encoded.length).to.eql(64);
          expect(encoded).to.eql(expected.padStart(64, '0'));
        });
      });

      it('expect converted number to be treated as uint', () => {
        const uint256Bytes = ethers.utils.defaultAbiCoder.encode(
          ['uint256'],
          [LeafValueCoder.encode(9007199254740991)]
        );
        expect(uint256Bytes).to.eql('0x000000000000000000000000000000000001bc16d674ec7ff21f494c589c0000');
      });
    });
  });

  describe('.decode()', () => {
    describe('Uint to number', () => {
      const dataToTest: [number, string][] = [
        [0, ''],
        [1e-18, '01'],
        [1.7e-17, '0x11'],
        [1, '0de0b6b3a7640000'],
        [255, '0x0dd2d5fcf3bc9c0000'],
        [255, '0dd2d5fcf3bc9c0000'],
        [255.00255, '0x0dd2df0c29e0c96000'],
        [9007199254740991, '01bc16d674ec7ff21f494c589c0000'],
        [900719925474099.1, '2c68af0bb13ffe9cba87a2760000'],
        [1.900719925474099, '0x1a60b6b3a763ff38'],
      ];

      dataToTest.forEach((arr) => {
        const [expected, toConvert] = arr;

        it(`expect to convert ${toConvert} to ${expected}`, () => {
          expect(LeafValueCoder.decode(toConvert)).to.eql(expected);
        });
      });
    });

    it('expect to return undefined for non supported data', () => {
      expect(LeafValueCoder.decode('xxx')).to.eql(NaN);
    });
  });
});
