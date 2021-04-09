# Umbrella Network Toolbox

![Umbrella network - logo](./umb.network-logo.png)

NPM package with tools eg. coders and decoders for leaf data

[![npm version](https://badge.fury.io/js/%40umb-network%2Ftoolbox.svg)](https://badge.fury.io/js/%40umb-network%2Ftoolbox)

## Usage

### Coders

```typescript
import {LeafValueCoder, LeafKeyCoder, LeafType} from `@umb-network/toolbox`;

const f: number = 1234.0000987;

// encode data for leaf:
const leafData: Buffer = LeafValueCoder.encode(f, LeafType.TYPE_FLOAT);

// decode data
const originalValue: number = LeafValueCoder.decode(leaf.toString('hex'))

// encoder accepts Buffer or hex string
const encodedKey: Buffer = LeafKeyCoder.encode('eth-usd');
const decodedKey: string = LeafKeyCoder.decode(encodedKey)
```

## Contract Registry
```typescript
import {ContractRegistry} from `@umb-network/toolbox`;

new ContractRegistry(provider, contractRegistryAddress).getAddrerss('Chain');
```

## Proof verification
```typescript
import {ContractRegistry, ChainContract, APIClient} from `@umb-network/toolbox`;

const chainContractAddress = new ContractRegistry(provider, contractRegistryAddress).getAddress('Chain');
const chainContract = new ChainContract(provider, chainContractAddress);
const apiClient = new APIClient({
  baseURL: 'https://sanctuary-playground-api.network/api/',
  chainContract,
});

const verificationResult = await apiClient.verifyProofForNewestBlock(
  'ETH-USD'
);

console.log(verificationResult) // output: {success: true, value: 1234} or {success: false, value: 1234}
```

# ContractRegistry
## Initialization
```ts
  import { ContractRegistry } from `@umb-network/toolbox`;

  const CONTRACT_REGISTRY_ADDRESS = '0x***';
  const contractRegistry = new ContractRegistry(provider, CONTRACT_REGISTRY_ADDRESS);
```

## ContractRegistry#getAddress
### Signature
```ts
contractRegistry.getAddress(name: string): Promise<string>;
```

### Examples
Getting the address of the Chain contract:
```ts
const chainContractAddress: string = await contractRegistry.getAddrerss('Chain');
```

# ChainContract
## Initialization
```ts
import { ContractRegistry, ChainContract } from `@umb-network/toolbox`;

// Getting the address of the Chain contract from registry
const chainContractAddress = new ContractRegistry(provider, contractRegistryAddress).getAddress('Chain');
// Initializing ChainContract
const chainContract = new ChainContract(provider, chainContractAddress);
```

## ChainContract#verifyProofForBlock
### Signature
```ts
chainContract.verifyProofForBlock(
  blockId: number,
  proof: string[],
  key: string,
  value: string,
  leafType: LeafType,
): Promise<boolean>;
```
### Examples
```ts
import { LeafType } from `@umb-network/toolbox`;

const verified: boolean = await chainContract.verifyProofForBlock(
  blockId,
  proof,
  'ETH-USD',
  LeafType.TYPE_FLOAT,
);
```

# LeafKeyCoder
## LeafKeyCoder#encode
### Signature
```ts
LeafKeyCoder.encode(key: string): Buffer;
```

### Examples
```ts
import { LeafKeyCoder } from '@umb-network/toolbox';

LeafKeyCoder.encode('ETH-USD'); // <Buffer 65 74 68 2d 75 73 64>
```

## LeafKeyCoder#decode
### Signature
```ts
LeafKeyCoder.decode(key: Buffer | string): string;
```

### Examples
```ts
import { LeafKeyCoder } from '@umb-network/toolbox';

LeafKeyCoder.decode(Buffer.from('6574682d757364', 'hex')); // 'ETH-USD'
LeafKeyCoder.decode('0x6574682d757364'); // 'ETH-USD'
LeafKeyCoder.decode('6574682d757364'); // 'ETH-USD'
```

# LeafValueCoder
## LeafValueCoder.encode
### Signature
```ts
LeafValueCoder.encode(data: any, type: LeafType): Buffer;
```

### Examples
```ts
import { LeafValueCoder } from '@umb-network/toolbox';

LeafValueCoder.encode('0x11', LeafType.TYPE_HEX); // <Buffer 11 ff 01>
LeafValueCoder.encode(10, LeafType.TYPE_INTEGER); // <Buffer 0a ff 02>
LeafValueCoder.encode(10.01, LeafType.TYPE_FLOAT); // <Buffer 03 e9 ee 02 ff 03>
```

## LeafValueCoder.decode
### Signature
```ts
LeafValueCoder.decode(leaf: string): string | number | undefined {
```
### Examples
```ts
import { LeafValueCoder } from '@umb-network/toolbox';

LeafValueCoder.decode('0x11ff01') // '0x11'
LeafValueCoder.decode('0x0aff02') // 10
LeafValueCoder.decode('0x03e9ee02ff03') // 10.01
LeafValueCoder.decode('') // undefined
```

# converters
## converters.numberToUint256
### Signature
```ts
function numberToUint256(n: number): string;
```

### Examples
```ts
import { converters } from '@umb-network/toolbox';

converters.numberToUint256(10); // '0x8ac7230489e80000'
converters.numberToUint256(10.01); // '0x8aeaa9f6f9a90000'
```

## converters.strToBytes32

### Signature
```ts
function strToBytes32(n: string): string;
```

### Examples
```ts
import { converters } from '@umb-network/toolbox';

converters.strToBytes32('Hi there!'); // '0x4869207468657265210000000000000000000000000000000000000000000000'
```

# APIClient

## Initialization
```ts
import {ContractRegistry, ChainContract, APIClient} from `@umb-network/toolbox`;

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
```ts
apiClient.getBlocks(options?: { offset?: number; limit?: number }): Promise<IChainBlock[]>;
```

### Examples
Code:
```ts
await apiClient.getBlocks(); // [{...}, {...}]
await apiClient.getBlocks({ offset: 10, limit: 10 }); // [{...}, {...}]
```
Response example:
```ts
[
  {
    _id: "block::350",
    height: 350,
    status: "finalized",
    anchor: new BigNumber(3959),
    timestamp: new Date("2021-01-17 22:52:19.000Z"),
    root: "0x1487f96993077b4de7738c1701028e92623752a48c7330fe99a5ca6db6cbcd58",
    minter: "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4",
    staked: new BigNumber(1000000000000000000),
    power: new BigNumber(1000000000000000000),
    voters: [ 
      "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4"
    ],
    votes: {
      "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4": "1000000000000000000"
    },
    numericFcdKeys: [ 
      "DIA-USD", 
      "ETH-EUR", 
      "ETH-USD", 
      "QQQ-USD", 
      "SPY-USD"
    ]
  }
]
```

## APIClient#getNewestBlock
### Signature
```ts
apiClient.getNewestBlock(): Promise<IChainBlock>;
```

### Examples
Code:
```ts
await apiClient.getNewestBlock(); // {...}
```
Response example:
```ts
{
  _id: "block::350",
  height: 350,
  status: "finalized",
  anchor: new BigNumber('3959'),
  timestamp: new Date("2021-01-17 22:52:19.000Z"),
  root: "0x1487f96993077b4de7738c1701028e92623752a48c7330fe99a5ca6db6cbcd58",
  minter: "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4",
  staked: new BigNumber(1000000000000000000),
  power: new BigNumber(1000000000000000000),
  voters: [ 
    "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4"
  ],
  votes: {
    "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4": "1000000000000000000"
  },
  numericFcdKeys: [ 
    "DIA-USD", 
    "ETH-EUR", 
    "ETH-USD", 
    "QQQ-USD", 
    "SPY-USD"
  ]
}
```

## APIClient#getBlock
### Signature
```ts
apiClient.getBlock(blockId: string): Promise<IChainBlock>;
```

### Examples
Code:
```ts
await apiClient.getBlock('block::350'); // {...}
```
Response example:
```ts
{
  _id: "block::350",
  height: 350,
  status: "finalized",
  anchor: new BigNumber(3959),
  timestamp: new Date("2021-01-17 22:52:19.000Z"),
  root: "0x1487f96993077b4de7738c1701028e92623752a48c7330fe99a5ca6db6cbcd58",
  minter: "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4",
  staked: new BigNumber(1000000000000000000),
  power: new BigNumber(1000000000000000000),
  voters: [ 
    "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4"
  ],
  votes: {
    "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4": "1000000000000000000"
  },
  numericFcdKeys: [ 
    "DIA-USD", 
    "ETH-EUR", 
    "ETH-USD", 
    "QQQ-USD", 
    "SPY-USD"
  ]
}
```

## APIClient#getLeavesOfBlock
### Signature
```ts
apiClient.getLeavesOfBlock(blockId: string): Promise<IBlockLeafWithProof[]>;
```

### Examples
Code:
```ts
await apiClient.getLeavesOfBlock('block::350'); // [{...}]
```

Response example:
```ts
[
  {
    _id: "leaf::block::350::ETH-USD",
    blockId: "block::350",
    key: "ETH-USD",
    value: "0x01e9f0ee02ff03",
    proof: [ 
      "0xec7bfd48eaed63ecebf7183d82bb7d500ce172c1af20cdf17e198b3d37a111da", 
      "0xa698a5eb897e60912e6e4c1edac155656e5077b0e9434284fd4078cd08d1d4ac", 
      "0xcc73f8fcfee8e458565c7f2d0ed3da0bfe56962996d1839342b694fe2803bdd8", 
      "0x38d59484a10df3dba07c39fb9532b450abe777bf7fead24095d3ad8deafdb913"
    ]
  }
]
```

## APIClient#getKeys
### Signature
```ts
apiClient.getKeys(): Promise<IKeyWithAdditionalInfo[]>;
```

### Examples
Code:
```ts
await apiClient.getKeys(); // [{...}]
```

Response example:
```ts
[
  {
    id: "eth-usd",
    name: "ETH-USD [Spot]",
    sourceUrl: "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
    leafLabel: "eth-usd",
    valuePath: "$.USD",
    discrepancy: 0.1
  }
]
```

## APIClient#getProofs
### Signature
```ts
apiClient.getProofs(keys: string[]): Promise<IProofs | null>;
```

### Examples
Code:
```ts
await apiClient.getProofs("ETH-USD"); // {...}
```
Response example:
```ts
{
  block: {
    staked: new BigNumber(1000000000000000000),
    power: new BigNumber(1000000000000000000),
    voters: ["0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4"],
    votes: {
      "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4": "1000000000000000000"
    },
    numericFcdKeys: ["DIA-USD", "ETH-EUR", "ETH-USD", "QQQ-USD", "SPY-USD"],
    _id: "block::350",
    height: 350,
    __v: 1,
    anchor: new BigNumber(3959),
    timestamp: new Date("2021-01-17T22:52:19.000Z"),
    status: "finalized",
    minter: "0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4",
    root:
      "0x1487f96993077b4de7738c1701028e92623752a48c7330fe99a5ca6db6cbcd58"
  },
  keys: ["ETH-USD"],
  leaves: [
    {
      proof: [
        "0xec7bfd48eaed63ecebf7183d82bb7d500ce172c1af20cdf17e198b3d37a111da",
        "0xa698a5eb897e60912e6e4c1edac155656e5077b0e9434284fd4078cd08d1d4ac",
        "0xcc73f8fcfee8e458565c7f2d0ed3da0bfe56962996d1839342b694fe2803bdd8",
        "0x38d59484a10df3dba07c39fb9532b450abe777bf7fead24095d3ad8deafdb913"
      ],
      _id: "leaf::block::350::ETH-USD",
      blockId: "block::350",
      key: "ETH-USD",
      __v: 0,
      value: "0x01e9f0ee02ff03"
    }
  ]
}
```

## APIClient#verifyProofForNewestBlock
### Signature
```ts
apiClient.verifyProofForNewestBlock(
  key: string,
  leafType: LeafType.TYPE_INTEGER | LeafType.TYPE_FLOAT,
): Promise<{success: boolean, value: number}>;

apiClient.verifyProofForNewestBlock(
  key: string,
  leafType: LeafType.TYPE_HEX,
): Promise<{success: boolean, value: string}>;
```

### Examples
Code:
```ts
await apiClient.verifyProofForNewestBlock("ETH-USD", LeafType.TYPE_FLOAT); // {...}
```
Response example for successful verification:
```ts
{
  success: true,
  value: 1254.24
}
```
Response example for unsuccessful verification:
```ts
{
  success: false,
  value: 1254.24
}
```
