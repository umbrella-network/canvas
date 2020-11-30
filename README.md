# canvas

NPM package with tools eg. coders and decoders for leaf data

## Usage

```javascript
import toolbox from `@umbrella/toolbox`;


const f: number = 1234.0000987;

// encode data for leaf:
const leafData = LeafTypeEncoder.apply(f, LeafType.TYPE_FLOAT).toString('hex');

// decode data
const originalValue = LeafTypeDecoder.apply(leaf)
```
