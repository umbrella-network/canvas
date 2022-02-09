import 'hardhat';
import '@nomiclabs/hardhat-ethers';
import { expect, use } from 'chai';
import { waffleChai } from '@ethereum-waffle/chai';
import { BigNumber, Contract } from 'ethers';
import * as hre from 'hardhat';
const ethers = hre.ethers;
import * as fs from 'fs';

use(waffleChai);

const setup = async () => {
  if (!fs.readdirSync('./src/contracts/examples').includes('artifacts')) {
    await hre.run('compile');
  }
  const ExampleContract = await ethers.getContractFactory('ExampleContract');
  const exampleContract = await ExampleContract.deploy();
  await exampleContract.deployed();
  return {
    exampleContract,
  };
};

describe('ExampleContract', () => {
  let exampleContract: Contract;

  before(async () => {
    return ({ exampleContract } = await setup());
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
});

