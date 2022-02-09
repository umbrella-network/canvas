import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

export default {
  solidity: {
    compilers: [
      {
        version: '0.6.8'
      }
    ]
  },
  paths: {
    tests: './test/contracts',
    sources: './src/contracts/examples',
    artifacts: './src/contracts/examples/artifacts'
  }
};

