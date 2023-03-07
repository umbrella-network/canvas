[![SDK QA - Development](https://github.com/umbrella-network/canvas/actions/workflows/pipeline.develop.yml/badge.svg?branch=develop)](https://github.com/umbrella-network/canvas/actions/workflows/pipeline.develop.yml)
[![SDK QA - Production](https://github.com/umbrella-network/canvas/actions/workflows/pipeline.yml/badge.svg?branch=main)](https://github.com/umbrella-network/canvas/actions/workflows/pipeline.yml)
# Umbrella Network Toolbox

![Umbrella network - logo](./umb.network-logo.png)

NPM package with tools eg. coders and decoders for leaf data

[![npm version](https://badge.fury.io/js/%40umb-network%2Ftoolbox.svg)](https://badge.fury.io/js/%40umb-network%2Ftoolbox)

## Usage

### Coders

```typescript
import {LeafValueCoder, LeafKeyCoder} from '@umb-network/toolbox';

const f: number = 1234.0000987;

// encode data for leaf:
const leafData: Buffer = LeafValueCoder.encode(f);

// decode data
const originalValue: number = LeafValueCoder.decode(leafData.toString('hex'))

// encoder accepts Buffer or hex string
const encodedKey: Buffer = LeafKeyCoder.encode('ETH-USD');
const decodedKey: string = LeafKeyCoder.decode(encodedKey)
```

## Contract Registry

```typescript
import {ContractRegistry} from '@umb-network/toolbox';

new ContractRegistry(provider, contractRegistryAddress).getAddrerss('Chain');
```

## Proof verification

```typescript
import {ContractRegistry, ChainContract, APIClient} from '@umb-network/toolbox';

const chainContractAddress = new ContractRegistry(provider, contractRegistryAddress).getAddress('Chain');
const chainContract = new ChainContract(provider, chainContractAddress);
const apiClient = new APIClient({
  baseURL: 'https://api.umb.network/',
  chainContract,
});

const verificationResult = await apiClient.verifyProofForNewestBlock('ETH-USD');

// output: {success: true, value: 1234, dataTimestamp: 1234567} or throw
console.log(verificationResult)
```

# ContractRegistry

## Initialization

```typescript
import {ContractRegistry} from '@umb-network/toolbox';

const CONTRACT_REGISTRY_ADDRESS = '0x***';
const contractRegistry = new ContractRegistry(provider, CONTRACT_REGISTRY_ADDRESS);
```

## ContractRegistry#getAddress

### Signature

```shell
contractRegistry.getAddress(name: string): Promise<string>;
```

### Examples

Getting the address of the Chain contract:

```typescript
const chainContractAddress: string = await contractRegistry.getAddrerss('Chain');
```

# ChainContract

## Initialization

```typescript
import {ContractRegistry, ChainContract} from '@umb-network/toolbox';

// Getting the address of the Chain contract from registry
const chainContractAddress = new ContractRegistry(provider, contractRegistryAddress).getAddress('Chain');
// Initializing ChainContract
const chainContract = new ChainContract(provider, chainContractAddress);
```

## ChainContract#verifyProofForBlock

### Signature

```shell
chainContract.verifyProofForBlock(
  blockHeight: number,
  proof: string[],
  key: string,
  value: string
  ): Promise<boolean>;
```

### Examples

```typescript
const verified: boolean = await chainContract.verifyProofForBlock(
  blockId,
  proof,
  'ETH-USD',
  '2755000000000000000000'
);
```

# LeafKeyCoder

## LeafKeyCoder#encode

### Signature

```sh
LeafKeyCoder.encode(key: string): Buffer;
```

### Examples

```typescript
import {LeafKeyCoder} from '@umb-network/toolbox';

LeafKeyCoder.encode('ETH-USD');
```

## LeafKeyCoder#decode

### Signature

```shell
LeafKeyCoder.decode(key: Buffer | string): string;
```

### Examples

```typescript
import {LeafKeyCoder} from '@umb-network/toolbox';

LeafKeyCoder.decode(Buffer.from('4554482d555344', 'hex')); // 'ETH-USD'
LeafKeyCoder.decode('0x4554482d555344'); // 'ETH-USD'
```

# LeafValueCoder

## LeafValueCoder.encode

### Signature

```shell
LeafValueCoder.encode(n: number, bits = 256): Buffer;
LeafValueCoder.encodeHex(leafAsHex: string, bits = 256): Buffer;
```

### Examples

```typescript
import {LeafValueCoder} from '@umb-network/toolbox';

// 0000000000000000000000000000000000000000000000008ac7230489e80000
LeafValueCoder.encode(10);

// 0000000000000000000000000000000000000000000000008aeaa9f6f9a90000
LeafValueCoder.encode(10.01);

LeafValueCoder.encodeHex('01A')
```

## LeafValueCoder.decode

### Signature

```shell
LeafValueCoder.decode(leaf: string): number
```

### Examples

```typescript
import {LeafValueCoder} from '@umb-network/toolbox';

LeafValueCoder.decode('0x1') // 1e-18
LeafValueCoder.decode('0x11') // 1.7e-17
LeafValueCoder.decode('0de0b6b3a7640000') // 1.0
LeafValueCoder.decode('') // 0
```

# APIClient

## Initialization

```typescript
import {ContractRegistry, ChainContract, APIClient} from '@umb-network/toolbox';

const chainContractAddress = new ContractRegistry(provider, contractRegistryAddress).getAddress('Chain');
const chainContract = new ChainContract(provider, chainContractAddress);

const apiClient = new APIClient({
  apiKey: 'xxx',
  baseURL: 'https://sanctuary-playground-api.network/api/',
  chainContract,
});
```

## APIClient#getBlocks

### Signature

```shell
apiClient.getBlocks(options ? : {offset? : number; limit? : number}): Promise<IChainBlock[]>;
```

### Examples

Code:

```typescript
await apiClient.getBlocks();
await apiClient.getBlocks({offset: 10, limit: 10});
```

Response example:

```json
[
  {
    "staked": "3000000000000000000",
    "power": "3000000000000000000",
    "voters": [
      "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0",
      "0xDc3eBc37DA53A644D67E5E3b5BA4EEF88D969d5C"
    ],
    "votes": {
      "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0": "2000000000000000000",
      "0xDc3eBc37DA53A644D67E5E3b5BA4EEF88D969d5C": "1000000000000000000"
    },
    "_id": "block::8681",
    "blockId": 8681,
    "__v": 1,
    "chainAddress": "0xc94A585C1bC804C03A864Ee766Dd1B432f73f9A8",
    "dataTimestamp": "2021-05-14T11:57:02.000Z",
    "root": "0x08dc10051a87f6ee6856f1758a2b4921e43aa257e9c346b6bb6e8a3f21f531e1",
    "status": "finalized",
    "anchor": "8833714",
    "minter": "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0"
  }
]
```

## APIClient#getNewestBlock

### Signature

```shell
apiClient.getNewestBlock(): Promise<IChainBlock>;
```

### Examples

Code:

```typescript
await apiClient.getNewestBlock();
```

Response example:

```json
{
  "staked": {
    "type": "BigNumber",
    "hex": "0x6124fee993bc0000"
  },
  "power": {
    "type": "BigNumber",
    "hex": "0x4563918244f40000"
  },
  "voters": [
    "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0",
    "0xDc3eBc37DA53A644D67E5E3b5BA4EEF88D969d5C"
  ],
  "votes": {
    "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0": "2000000000000000000",
    "0xDc3eBc37DA53A644D67E5E3b5BA4EEF88D969d5C": "3000000000000000000"
  },
  "_id": "block::120539",
  "blockId": 120539,
  "__v": 1,
  "chainAddress": "0x41f16D60C58a0D13C89149A1675c0ca39e170EDD",
  "dataTimestamp": "2021-05-23T14:01:52.000Z",
  "root": "0xde1f03f6e568365db09e6e4a826f2591c32d393bd64dc6998fa4ec86b6dd2c3e",
  "status": "finalized",
  "anchor": {
    "type": "BigNumber",
    "hex": "0x017db636"
  },
  "minter": "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0"
}
```

## APIClient#getBlock

### Signature

```shell
apiClient.getBlock(blockId: string): Promise<IChainBlock>;
```

### Examples

Code:

```typescript
await apiClient.getBlock(350); // {...}
```

Response example: same as for `getNewestBlock`

## APIClient#getLeavesOfBlock

API: `/blocks/8683/leaves`

### Signature

```shell
apiClient.getLeavesOfBlock(blockId: string): Promise<IBlockLeafWithProof[]>;
```

### Examples

Code:

```typescript
await apiClient.getLeavesOfBlock(350);
```

Response example:

```json
[
  {
    "proof": [
      "0xb01d5b067b172ba0a361cf7fe7375a55a727dd1a20834f0962185f37b8981371",
      "0x3b113a401b261dfb04166a9c652af63ccb6d77a5db0b4c0d127ecbc306fdb990",
      "0xda4a6c7a5f7414401f4cb34a536518ad48ee742797506650249bcc34774c5f41",
      "0x96c4d220b2697326a21d3ef00c1cb5fd1afd1724acfca4d78c4d8bd79c32e775",
      "0x71b12dff5ec4202dbe8d7352b36058e883025859097aa17400c347d49edba62c",
      "0x006dca779b13b296942d266433327c4c35f5122419474a753d854ce2ebe0c271",
      "0xb8aa806a9e49fff22eab7f86c56584db8084c6fbbbef8c9a8a5ef35607be72c2"
    ],
    "_id": "block::120536::leaf::ADA-BTC",
    "blockId": "120536",
    "key": "ADA-BTC",
    "__v": 0,
    "value": "0x00000000000000000000000000000000000000000000000000001fe0b6cca400"
  }
]
```

## APIClient#getProofs

### Signature

```shell
apiClient.getProofs(keys: string[]): Promise<IProofs | null>;
```

### Examples

Code:

```typescript
await apiClient.getProofs("ETH-USD");
```

Response example:

```json
{
  "block": {
    "staked": {
      "type": "BigNumber",
      "hex": "0x6124fee993bc0000"
    },
    "power": {
      "type": "BigNumber",
      "hex": "0x4563918244f40000"
    },
    "voters": [
      "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0",
      "0xDc3eBc37DA53A644D67E5E3b5BA4EEF88D969d5C"
    ],
    "votes": {
      "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0": "2000000000000000000",
      "0xDc3eBc37DA53A644D67E5E3b5BA4EEF88D969d5C": "3000000000000000000"
    },
    "_id": "block::120541",
    "blockId": 120541,
    "__v": 1,
    "chainAddress": "0x41f16D60C58a0D13C89149A1675c0ca39e170EDD",
    "dataTimestamp": "2021-05-23T14:03:52.000Z",
    "root": "0x9984950d3ac4bd4e98912db7aeb91c8bc1a50a0af84b9c0d99249ff46d5a1b06",
    "status": "finalized",
    "anchor": {
      "type": "BigNumber",
      "hex": "0x017db652"
    },
    "minter": "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0"
  },
  "keys": [
    "ADA-BTC",
    "ADA-USD",
    "ADA-USDT",
    "AMPL-USD-VWAP-1day",
    "ATOM-USDT",
    "BCH-BTC",
    "BNB-BTC",
    "BNB-BUSD",
    "BNB-USD",
    "BNT-USD"
  ],
  "leaves": [
    {
      "proof": [
        "0x4ea61613b7559f7f90d5ec5758268d9db4b40d285bb91f0836a482db86108c9c",
        "0x31c294d7875566fddab273247575b0cf746f46959efacd1cbae0bc363bed8a44",
        "0x2a3169d555d173f035ba472e902fe20740cbd48c13e72aaac0971021dbc35ad6",
        "0x0f6e1194a152d1bd86404ab8a6ebd9d499e1536c8c9e9d3387bdbe0ab3afacd0",
        "0xc8dcc3b734fa40f1f0bf5fe83f4edaf0e6646169400f3f6bf3cfbf601cb5ab93",
        "0xf3a886434970e44c0d1beae167e14e5ce150fefa3205f0a5f1fcc4a7f9518514",
        "0x03181c924011b0f040e13936715134692e48b13d3c85929f960356e9c94e0fe7"
      ],
      "_id": "block::120541::leaf::ADA-BTC",
      "blockId": "120541",
      "key": "ADA-BTC",
      "__v": 0,
      "value": "0x00000000000000000000000000000000000000000000000000001fe0b6cca400"
    }
  ]
}
```

## APIClient#verifyProofForNewestBlock

### Signature

```shell
async verifyProofForNewestBlock < T extends string | number = string | number >
  (key: string): Promise <{ success: boolean, value: T, dataTimestamp: Date }>
```

### Examples

Code:

```typescript
await apiClient.verifyProofForNewestBlock("ETH-USD");
```

Response example for successful verification:

```json
{
  success: true,
  value: 1254.24,
  dataTimestamp: "2020-05-14T13:34: 08.000Z"
}
```

For unsuccessful it throws.

# RPCSelector

## Initialization

```ts
import {RPCSelector} from '@umb-network/toolbox';

// you can use either comma-separated URLs or an array of URLs
const URLS = 'http://rpc-1:8545,http://rpc-2:8545';
// or
const URLS = ['http://rpc-1:8545', 'http://rpc-2:8545'];

const rpcSelector = new RPCSelector(URLS);
```

## RPCSelector#apply

### Signature

```shell
rpcSelector.selectByTimestamp(): Promise<string>
rpcSelector.selectByLatestBlockNumber(): Promise<string>
```

### Examples

Code

```ts
const youngestBlockAgeRPC = await rpcSelector.selectByTimestamp();
const latestBlockNumberRPC = await rpcSelector.selectByLatestBlockNumber();

// use it to create a new ethers provider
const provider = new JsonRpcProvider(youngestBlockAgeRPC);
```

## NPM Package

```
npm login
npm publish
```
