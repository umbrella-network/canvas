# Umbrella Network Toolbox

![Umbrella network - logo](./umb.network-logo.png)

NPM package with tools eg. coders and decoders for leaf data

[![npm version](https://badge.fury.io/js/%40umb-network%2Ftoolbox.svg)](https://badge.fury.io/js/%40umb-network%2Ftoolbox)

## Usage

### Coders

```typescript
import {LeafValueCoder, LeafKeyCoder, LeafType} from '@umb-network/toolbox';

const f: number = 1234.0000987;

// encode data for leaf:
const leafData: Buffer = LeafValueCoder.encode(f, LeafType.TYPE_FLOAT);

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
  baseURL: 'https://sanctuary-playground-api.network/api/',
  chainContract,
});

const verificationResult = await apiClient.verifyProofForNewestBlock('ETH-USD');

console.log(verificationResult) // output: {success: true, value: 1234} or throw
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
  value: string,
  leafType: LeafType): Promise<boolean>;
```

### Examples

```typescript
import {LeafType} from '@umb-network/toolbox';

const verified: boolean = await chainContract.verifyProofForBlock(
  blockHeight,
  proof,
  'ETH-USD',
  LeafType.TYPE_FLOAT,
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

LeafKeyCoder.encode('ETH-USD'); // <Buffer 65 74 68 2d 75 73 64>
```

## LeafKeyCoder#decode

### Signature

```shell
LeafKeyCoder.decode(key: Buffer | string): string;
```

### Examples

```typescript
import {LeafKeyCoder} from '@umb-network/toolbox';

LeafKeyCoder.decode(Buffer.from('6574682d757364', 'hex')); // 'ETH-USD'
LeafKeyCoder.decode('0x6574682d757364'); // 'ETH-USD'
LeafKeyCoder.decode('6574682d757364'); // 'ETH-USD'
```

# LeafValueCoder

## LeafValueCoder.encode

### Signature

```shell
LeafValueCoder.encode(data: any, type: LeafType): Buffer;
```

### Examples

```typescript
import {LeafValueCoder} from '@umb-network/toolbox';

LeafValueCoder.encode('0x11', LeafType.TYPE_HEX); // <Buffer 11 ff 01>
LeafValueCoder.encode(10, LeafType.TYPE_INTEGER); // <Buffer 0a ff 02>
LeafValueCoder.encode(10.01, LeafType.TYPE_FLOAT); // <Buffer 03 e9 ee 02 ff 03>
```

## LeafValueCoder.decode

### Signature

```shell
LeafValueCoder.decode(leaf: string): string | number | undefined
```

### Examples

```typescript
import {LeafValueCoder} from '@umb-network/toolbox';

LeafValueCoder.decode('0x11ff01') // '0x11'
LeafValueCoder.decode('0x0aff02') // 10
LeafValueCoder.decode('0x03e9ee02ff03') // 10.01
LeafValueCoder.decode('') // undefined
```

# converters

## converters.numberToUint256

### Signature

```shell
function numberToUint256(n: number): string;
```

### Examples

```typescript
import {converters} from '@umb-network/toolbox';

converters.numberToUint256(10); // '0x8ac7230489e80000'
converters.numberToUint256(10.01); // '0x8aeaa9f6f9a90000'
```

## converters.strToBytes32

### Signature

```shell
function strToBytes32(n: string): string;
```

### Examples

```typescript
import {converters} from '@umb-network/toolbox';

converters.strToBytes32('Hi there!'); // '0x4869207468657265210000000000000000000000000000000000000000000000'
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
  "_id": "block::8683",
  "blockId": 8683,
  "__v": 1,
  "chainAddress": "0xc94A585C1bC804C03A864Ee766Dd1B432f73f9A8",
  "dataTimestamp": "2021-05-14T11:58:44.000Z",
  "root": "0x77b003cda5af3e6256eaa6dd591ef62b83dc61207e74a0318f387bb9b4adda64",
  "status": "finalized",
  "anchor": "8833747",
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
    "block": {
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
      "_id": "block::8715",
      "blockId": 8715,
      "__v": 1,
      "chainAddress": "0xc94A585C1bC804C03A864Ee766Dd1B432f73f9A8",
      "dataTimestamp": "2021-05-14T12:26:02.000Z",
      "root": "0x26d3f38382e60d459304a0c6da84365e49aa371fbbe71012d5d85ae82daef6dc",
      "status": "finalized",
      "anchor": "8834294",
      "minter": "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0"
    },
    "keys": [
      "eth-usd"
    ],
    "leaves": []
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
    "_id": "block::8785",
    "blockId": 8785,
    "__v": 1,
    "chainAddress": "0xc94A585C1bC804C03A864Ee766Dd1B432f73f9A8",
    "dataTimestamp": "2021-05-14T13:25:38.000Z",
    "root": "0x2b80af04191488b681c2a4e9b6de2af65ad41989790552fbbe9df5806edf9b64",
    "status": "finalized",
    "anchor": "8835485",
    "minter": "0x998cb7821e605cC16b6174e7C50E19ADb2Dd2fB0"
  },
  "keys": [
    "ETH-USD"
  ],
  "leaves": [
    {
      "proof": [
        "0x05d50c714affbf38869af124d95aa24f6a833fc73fee4d83433bea4fb48aa827",
        "0xec6ee8a045775f222b3b25ec2a261d95d85a5f67ca7f84ee69363da335593f83",
        "0x57da399a6b1fec549c2e2966d6b5db8f3e7a0ea97d96cc0eca3c3b5c2179c3da",
        "0x01deb8e0d56fbdef560d90ebbb78c9bd35e8d5d39ee653b0d5e0ca8f1a212838",
        "0x4bdb9dacb8a0d4366835d012c5968de190b56d8c9f9d0dd174710c769a2b4006",
        "0xdc7405bef384e420fd7950bb92c96153d20e3ace36d27860263b2e831e053d4a"
      ],
      "_id": "block::8785::leaf::ETH-USD",
      "blockId": "8785",
      "key": "ETH-USD",
      "__v": 0,
      "value": "0x0511b9ee02ff03"
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
