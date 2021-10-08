import { expect } from 'chai';

import { SortedMerkleTree } from '../../src';
import { LeafValueCoder } from '../../src';

describe('SortedMerkleTree', () => {
  it('expect to squash root and verify it', () => {
    const tree = new SortedMerkleTree({
      a: LeafValueCoder.encode(1, 'a'),
      b: LeafValueCoder.encode(2, 'b'),
    });

    expect(tree.getRoot()).eql('0xaf2e73e60e165f7d9065b4b5e8419ff907a0ba801e686156ae90c9dbbf747db3');
    expect(tree.getRoot(0)).eql('0xaf2e73e60e165f7d9065b4b5e8419ff907a0ba801e686156ae90c9db000000');
    expect(tree.getRoot(0).length).eql(64);

    expect(tree.verifyProof(tree.getProofForKey('a'), tree.getRoot(), tree.createLeafHash('a'))).eql(true);
    expect(tree.verifyProof(tree.getProofForKey('a'), tree.getRoot(123), tree.createLeafHash('a'))).eql(true);
  });

  it('.flattenProofs expect', () => {
    const proof1 = [
      '0x9f6ec43bda049c7170a46ab9a5f8c968e97b7833dddd69fd28e898e724a61677',
      '0x2b644b91eccb6076b40ea5ee3b343025ae0309d479396323717962776d30568f',
      '0x74b0e87901af62f880f12fe4f60a0b2a02a1df20bd70fe8b5b3391e289420fbc',
      '0x23e02b8bd867ecdeb6db76b39f45a6189911c13a67ffefc27f67fc57009274e4',
      '0x23aec4a6a03f1f14a166b0e21b2a62ed5f30fc2f55747d33197e78ae1a964fb0',
      '0xdcf62463d7fe1c3da83bc3ce80cdcd95a56fca5d1182187f674ee4fabb74861c',
      '0xb8a978d7f8739a071ca2672df669b1bc5c9d6a36296e81e2efa26bbef8aefc44',
      '0xf258b2e25c8358545b448d09de381ea88f7d4edb6d2b7c9355a2ead16178531b',
      '0x13f8daeb0d4ff3145a1296833d42d178c24759414adfa8c2ce7a7d5901132216',
      '0x6e99c32f435b8ef3af23d1a9cfc8b6ba2de87897285142c3e09a2fcff578f10d',
      '0xde29bd1dcea144d7b9cd6330ea15a347eaaa44449c55744fb022510517faa36b',
    ];

    const proof2 = [
      '91349d1ff5c39910f54b11916df02e08aa8bc6a531e7aa095281ee59ea2b7f7f',
      '380958af2ddcc10a1c6399fdd6603d992a3abac9861e19d874a013c2bc3d7f5e',
      'bc2d1821fcb7c41d413ba220229adf723a57b26fab16fad8da8b56561a94974d',
      'dbee7bacdcfa0797765ed1ade77062ff6efb296cb3012b620ef88096aa2320c6',
      '611f4a526f14d68e01dba0e2da34c050f57a24ffc38ba9bead0ab722619b12ec',
      '99def8495dd887b75094cd88efa2e07eaa5db0438386a3047e9cc480ec92e156',
      '1c96e00040d0d89acf6badb32184ed315868b949e1c9179be5b74491122c42d2',
      'f29f17b1498603a2a3de333296fe97f19220a46e45255036b46a09b7b84e3a4d',
      '10fff546eb72933b2bdd708a8487ac9687c48565d4ff1bbc9d0f9dda9e004769',
      'fef308ecec4a13e88a729561a76c671e4fba15b3ba8736ff779bc6acd30c9587',
    ];

    const { proofs, proofItemsCounter } = SortedMerkleTree.flattenProofs([proof1, proof2]);
    expect(proofs.length).to.eql((11 + 10) * 64 + 2);
    expect(proofItemsCounter.length).to.eql(2);
    expect(proofItemsCounter).to.eql([11, 10]);
  });
});
