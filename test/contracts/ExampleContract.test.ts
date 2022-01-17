
import 'hardhat';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';

const setup = async (): Promise<Contract> => {
  const ExampleContract = await ethers.getContractFactory('ExampleContract');
  console.log('deploying ExampleContract');
  const exampleContract = await ExampleContract.deploy();
  await exampleContract.deployed();
  return exampleContract;
};

describe('ExampleContract', () => {
  let exampleContract: Contract;

  beforeEach(async () => {
    exampleContract = await setup();
  });

  describe('add()', () => {
    it('expect to add 2 positive integers', async () => {
      const sum = await exampleContract.add(10000000000, 10000000000);
      expect(sum).to.eql(20000000000);
    });
  });
});