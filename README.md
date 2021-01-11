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

const verificationResult = await apiClient.verifyProofForBlock(
  'eth-usd',
  LeafType.TYPE_INTEGER
);

console.log(verificationResult) // output: {success: true, value: 1234} or {success: false, value: 1234}
```
