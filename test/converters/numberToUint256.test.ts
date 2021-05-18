import {numberToUint256} from '../../src/converters';

import {expect} from 'chai';
import {ethers} from 'ethers';

describe('numberToUint256()', () => {
  const dataToTest: [number, string][] = [
    [0, '0x0'],
    [1, '0xde0b6b3a7640000'],
    [255, '0xdd2d5fcf3bc9c0000'],
    [5.004, '0x4571c77cd80e0000'],
    [9007199254740991, '0x1bc16d674ec7ff21f494c589c0000'],
    [900719925474099.1, '0x2c68af0bb13ffe9cba87a2760000'],
    [1.900719925474099, '0x1a60b6b3a763ff38']
  ];

  dataToTest.forEach(arr => {
    const [toConvert, expected] = arr;

    it(`expect to convert ${toConvert} to solidity uint256`, () => {
      expect(numberToUint256(toConvert)).to.eql(expected);
    });
  });

  it('expect converted number to be treated as uint256', () => {
    const uint256Bytes = ethers.utils.defaultAbiCoder.encode(['uint256'], [numberToUint256(9007199254740991)]);
    expect(uint256Bytes).to.eql('0x000000000000000000000000000000000001bc16d674ec7ff21f494c589c0000');
  });
});
