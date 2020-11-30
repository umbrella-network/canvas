# Umbrella Network Toolbox

![Umbrella network - logo](./umb.network-logo.png)

NPM package with tools eg. coders and decoders for leaf data

## Usage

```javascript
import {LeafValueCoder, LeafType} from `@umb-network/toolbox`;


const f: number = 1234.0000987;

// encode data for leaf:
const leafData = LeafValueCoder.encode(f, LeafType.TYPE_FLOAT).toString('hex');

// decode data
const originalValue = LeafValueCoder.decode(leaf)
```
