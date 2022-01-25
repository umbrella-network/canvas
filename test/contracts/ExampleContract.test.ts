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
  const maxRoot = BigNumber.from('240615969168004511545033772477625056927');
  return {
    exampleContract,
    maxSignedInt,
    minSignedInt,
    maxRoot,
  };
};

describe('ExampleContract', () => {
  let exampleContract: Contract, maxSignedInt: BigNumber, minSignedInt: BigNumber, maxRoot: BigNumber;

  beforeEach(async () => {
    return ({ exampleContract, maxSignedInt, minSignedInt, maxRoot } = await setup());
    //exampleContract = await setup();
  });

  describe('add()', () => {
    it('expect to add 2 positive integers', async () => {
      const sum = await exampleContract.add(10000000000, 10000000000);
      expect(sum).to.eql(BigNumber.from('20000000000'));
    });

    it('expect it to revert when trying to add numbers that will result in a sum larger than the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = 101;
      await expect(exampleContract.add(a, b)).to.revertedWith('will overflow max signed int');
    });

    it('expect it to not revert when adding numbers that will result in a sum equal to the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = 100;
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
      const b = -101;
      await expect(exampleContract.add(a, b)).to.revertedWith('will overflow min signed int');
    });

    it('expect it to not revert when adding negative numbers that will result in a sum equal to the min signed int', async () => {
      const a = minSignedInt.add(100);
      const b = -100;
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
      await expect(exampleContract.sub(a, b)).to.revertedWith('will overflow max signed int');
    });

    it('expect it to revert when performing subtraction that results in a difference greater than the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = -101;
      await expect(exampleContract.sub(a, b)).to.revertedWith('will overflow max signed int');
    });

    it('expect it to not revert when performing subtraction that results in a difference equal to the max signed int', async () => {
      const a = maxSignedInt.sub(100);
      const b = -100;
      await expect(exampleContract.sub(a, b)).not.to.be.reverted;
    });

    it('expect it to revert when performing subtraction that results in a difference smaller than the min signed int', async () => {
      const a = minSignedInt.add(100);
      const b = 101;
      await expect(exampleContract.sub(a, b)).to.revertedWith('will overflow min signed int');
    });

    it('expect it to revert when performing subtraction that results in a difference smaller than the min signed int', async () => {
      const a = minSignedInt;
      const b = 100;
      await expect(exampleContract.sub(a, b)).to.revertedWith('will overflow min signed int');
    });

    it('expect it to not revert when performing subtraction that results in a difference equal to the min signed int', async () => {
      const a = minSignedInt.add(100);
      const b = 100;
      await expect(exampleContract.sub(a, b)).not.to.be.reverted;
    });
  });

  describe('abs()', async () => {

    it('expect to return the absolute value of a positive integer', async () => {
      const abs = await exampleContract.abs(10000000000);
      expect(abs).to.eql(BigNumber.from('10000000000'));
    });

    it('expect to return the absolute value of a negative integer', async () => {
      const abs = await exampleContract.abs(-10000000000);
      expect(abs).to.eql(BigNumber.from('10000000000'));
    });

    it('expect to return the absolute value of zero', async () => {
      const abs = await exampleContract.abs(0);
      expect(abs).to.eql(BigNumber.from('0'));
    });
  });

  describe('mul()', async () => {
    it('expect to multiply a positive integer with a positive integer', async () => {
      const prod = await exampleContract.mul(10000000000, 10000000000);
      expect(prod).to.eql(BigNumber.from('100000000000000000000'));
    });

    it('expect to multiply a positive integer with a negative integer', async () => {
      const prod = await exampleContract.mul(10000000000, -10000000000);
      expect(prod).to.eql(BigNumber.from('-100000000000000000000'));
    });

    it('expect to multiply a negative integer with a negative integer', async () => {
      const prod = await exampleContract.mul(-10000000000, -10000000000);
      expect(prod).to.eql(BigNumber.from('100000000000000000000'));
    });

    it('expect it to not revert when performing multiplication that results in a product less than the max signed int', async () => {
      const a = maxRoot;
      const b = maxRoot;
      await expect(exampleContract.mul(a, b)).not.to.be.reverted;
    });

    it('expect it to revert when performing multiplication that results in a product greater than the max signed int', async () => {
      const a = maxRoot;
      const b = maxRoot.add(1);
      await expect(exampleContract.mul(a, b)).to.revertedWith('will overflow: a');
    });

    it('expect it to revert when performing multiplication that results in a product greater than the max signed int', async () => {
      const a = maxRoot.sub(10);
      const b = maxRoot.add(100);
      await expect(exampleContract.mul(a, b)).to.revertedWith('will overflow: b');
    });
  });

  describe('div()', async () => {
    it('expect to divide a positive integer by itself', async () => {
      const quotient = await exampleContract.div(10000000000, 10000000000);
      expect(quotient).to.eql(BigNumber.from('1'));
    });

    it('expect to divide a positive integer by a positive integer', async () => {
      const quotient = await exampleContract.div(100000000000, 10000000000);
      expect(quotient).to.eql(BigNumber.from('10'));
    });

    it('expect to divide a positive integer by a negative integer', async () => {
      const quotient = await exampleContract.div(100000000000, -10000000000);
      expect(quotient).to.eql(BigNumber.from('-10'));
    });

    it('expect to divide a negative integer by a positive integer', async () => {
      const quotient = await exampleContract.div(-100000000000, 10000000000);
      expect(quotient).to.eql(BigNumber.from('-10'));
    });

    it('expect to divide a negative integer by a negative integer', async () => {
      const quotient = await exampleContract.div(-100000000000, -10000000000);
      expect(quotient).to.eql(BigNumber.from('10'));
    });

    it('expect to divide zero by a positive integer', async () => {
      const quotient = await exampleContract.div(0, 10000000000);
      expect(quotient).to.eql(BigNumber.from('0'));
    });

    it('expect it to revert when dividing by zero', async () => {
      await expect(exampleContract.div(100000000, 0)).to.revertedWith('cannot divide by zero');
    });
  });

  describe('square()', async () => {
    it('expect to square a positive integer', async () => {
      const square = await exampleContract.square(10000000000);
      expect(square).to.eql(BigNumber.from('100000000000000000000'));
    });

    it('expect to square a negative integer', async () => {
      const square = await exampleContract.square(-10000000000);
      expect(square).to.eql(BigNumber.from('100000000000000000000'));
    });

    it('expect to square zero', async () => {
      const square = await exampleContract.square(0);
      expect(square).to.eql(BigNumber.from('0'));
    });

    it('expect to square the largest root without overflow', async () => {
      const square = await exampleContract.square(maxRoot);
      const expected = BigNumber.from('57896044618658097711785492504343953926579659927927152379400772292519990683329');
      expect(square).to.eql(expected);
    });

    it('expect it to revert when trying to square a number that will result in a value higher than the max signed int', async () => {
      const a = maxRoot.add(1);
      await expect(exampleContract.square(a)).to.revertedWith('will overflow');
    });
  });

  // TODO - add test cases for convertUintToInt()
});
