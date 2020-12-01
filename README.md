# Umbrella Network Toolbox

![Umbrella network - logo](./umb.network-logo.png)

NPM package with tools eg. coders and decoders for leaf data

## Usage

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
