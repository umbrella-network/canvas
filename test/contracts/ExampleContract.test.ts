import 'hardhat';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { expect, use } from 'chai';
import { waffleChai } from '@ethereum-waffle/chai';
import { BigNumber, Contract } from 'ethers';

use(waffleChai);

const setup = async () => {
  const ExampleContract = await ethers.getContractFactory('ExampleContract');
  //console.log('deploying ExampleContract');
  const exampleContract = await ExampleContract.deploy();
  await exampleContract.deployed();
  const maxSignedInt = BigNumber.from('57896044618658097711785492504343953926634992332820282019728792003956564819967');
  const minSignedInt = BigNumber.from('-57896044618658097711785492504343953926634992332820282019728792003956564819968');
  return {
    exampleContract,
    maxSignedInt,
    minSignedInt,
  };
};

describe('ExampleContract', () => {
  let exampleContract: Contract, maxSignedInt: BigNumber, minSignedInt: BigNumber;

  beforeEach(async () => {
    return ({ exampleContract, maxSignedInt, minSignedInt } = await setup());
    //exampleContract = await setup();
  });

  describe('add()', () => {
    it('expect to add 2 positive integers', async () => {
      const sum = await exampleContract.add(10000000000, 10000000000);
      expect(sum).to.eql(BigNumber.from('20000000000'));
    });

    it('expect it to revert when trying to add numbers that will result in a sum larger than the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = 101; // will result in sum +1 greater than max signed int
      await expect(exampleContract.add(a, b)).to.revertedWith('will overflow');
    });

    it('expect it to not revert when adding numbers that will result in a sum equal to the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = 100; // will result in sum == max signed int
      await expect(exampleContract.add(a, b)).not.to.be.reverted;
    });

    it('expect to add a positive and negative integer', async () => {
      const sum = await exampleContract.add(10000000000, -10000000000);
      expect(sum).to.eql(BigNumber.from('0'));
    });

    it('expect to add 2 negative integers', async () => {
      const sum = await exampleContract.add(-10000000000, -10000000000);
      expect(sum).to.eql(BigNumber.from('-20000000000'));
    });

    it('expect it to revert when trying to add negative numbers that will result in a sum smaller than the min signed int', async () => {
      const a = minSignedInt.add(100);
      const b = -101; // will result in sum -1 less than min signed int
      await expect(exampleContract.add(a, b)).to.revertedWith('will overflow');
    });

    it('expect it to not revert when adding negative numbers that will result in a sum equal to the min signed int', async () => {
      const a = minSignedInt.add(100);
      const b = -100; // will result in sum == min signed int
      await expect(exampleContract.add(a, b)).not.to.be.reverted;
    });
  });

  describe('sub()', async () => {
    it('expect to subtract a positive integer from a positive integer', async () => {
      const diff = await exampleContract.sub(10000000000, 10000000000);
      expect(diff).to.eql(BigNumber.from('0'));
    });

    it('expect to subtract a negative integer from a positive integer', async () => {
      const diff = await exampleContract.sub(10000000000, -10000000000);
      expect(diff).to.eql(BigNumber.from('20000000000'));
    });

    it('expect to subtract a positive integer from a negative integer', async () => {
      const diff = await exampleContract.sub(-10000000000, 10000000000);
      expect(diff).to.eql(BigNumber.from('-20000000000'));
    });

    it('expect to subtract a negative integer from a negative integer', async () => {
      const diff = await exampleContract.sub(-10000000000, -10000000000);
      expect(diff).to.eql(BigNumber.from('0'));
    });

    it('expect it to revert when performing subtraction that results in a difference greater than the max signed int', async () => {
      const a = maxSignedInt;
      const b = -100;
      await expect(exampleContract.sub(a, b)).to.revertedWith('will overflow');
    });

    it('expect it to revert when performing subtraction that results in a difference greater than the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = -101;
      await expect(exampleContract.sub(a, b)).to.revertedWith('will overflow');
    });

    it('expect it to not revert when performing subtraction that results in a difference equal to the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = -100;
      await expect(exampleContract.sub(a, b)).not.to.be.reverted;
    });

    // TODO - add tests for passing / failing the second require
  });
});
