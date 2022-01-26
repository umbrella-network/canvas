import 'hardhat';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { expect, use } from 'chai';
import { waffleChai } from '@ethereum-waffle/chai';
import { BigNumber, Contract } from 'ethers';

use(waffleChai);

const setup = async () => {
  // compile contracts....
  const ExampleContract = await ethers.getContractFactory('ExampleContract');
  const exampleContract = await ExampleContract.deploy();
  await exampleContract.deployed();
  return {
    exampleContract
  };
};

describe('ExampleContract', () => {
  let exampleContract: Contract;

  beforeEach(async () => {
    return ({ exampleContract} = await setup());
  });

  describe('convertUintToInt()', async () => {
    const maxUint224 = BigNumber.from('0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    const maxInt224 = maxUint224.sub(1).div(2);
    const minInt224 = maxInt224.add(1).mul(-1);

    const testCases = [
      { input: 0, expected: 0 },
      { input: 1, expected: 1 },
      { input: maxUint224.add(1).div(2).toString(), expected: minInt224 },
      { input: maxUint224.toString(), expected: -1 },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`testToInt(${input}) => ${expected}`, async () => {
        expect(await exampleContract.convertUintToInt(input)).to.eq(expected);
      });
    });
  });

  describe('convertIntToUInt', async () => {
    const maxUint224 = BigNumber.from('0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    const maxInt224 = maxUint224.sub(1).div(2);
    const minInt224 = maxInt224.add(1).mul(-1);

    const testCases = [
      { input: 0, expected: 0 },
      { input: 1, expected: 1 },
      { input: minInt224, expected: maxUint224.add(1).div(2).toString() },
      { input: -1, expected: maxUint224.toString() },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`testToInt(${input}) => ${expected}`, async () => {
        expect(await exampleContract.convertIntToUInt(input)).to.eq(expected);
      });
    });
  });
});
