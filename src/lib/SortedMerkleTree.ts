import { ethers } from 'ethers';
import { KeyValuePairs } from '../types/custom';
import { LeafKeyCoder } from '../services/LeafKeyCoder';
import { remove0x } from '../utils/helpers';

const hash = ethers.utils.solidityKeccak256;
const lastHash = '0x' + 'f'.repeat(64);
const emptyRoot = ethers.constants.HashZero;
const isOdd = (n: number): boolean => n % 2 !== 0;

export class SortedMerkleTree {
  static SQUASHED_ROOT_SIZE = 58;
  keys: Record<string, number>;
  tree: string[][];
  data: KeyValuePairs;

  constructor(keyValuePairs: KeyValuePairs) {
    this.keys = {};
    this.tree = [];
    this.data = keyValuePairs;

    if (Object.keys(this.data).length > 0) {
      this.createTree(this.addEvenHash(this.createLeaves(this.data)));
    }
  }

  hashIt(h1: string, h2: string): string {
    const sorted = [h1, h2].sort();
    return hash(['bytes32', 'bytes32'], [sorted[0], sorted[1]]);
  }

  leafHash(k: Buffer, v: Buffer): string {
    return hash(['bytes32', 'bytes32'], [k, v]);
  }

  createLeafHash(k: string): string {
    return this.leafHash(LeafKeyCoder.encode(k), this.data[k]);
  }

  addEvenHash(hashes: string[]): string[] {
    if (hashes.length > 1 && isOdd(hashes.length)) {
      hashes.push(lastHash);
    }

    return hashes;
  }

  createLeaves(keyValuePairs: KeyValuePairs): string[] {
    return Object.keys(keyValuePairs)
      .sort()
      .map((k, i) => {
        this.keys[k] = i;
        return this.createLeafHash(k);
      });
  }

  createNextTreeLevel(inputs: string[]): string[] {
    const hashes = [];

    for (let i = 0; i + 1 < inputs.length; i += 2) {
      hashes.push(this.hashIt(inputs[i], inputs[i + 1]));
    }

    return hashes;
  }

  createTree(inputs: string[]): void {
    this.tree.push(inputs);

    if (inputs.length > 1) {
      const nextLevelInputs = this.createNextTreeLevel(inputs);
      this.createTree(this.addEvenHash(nextLevelInputs));
    }
  }

  getLeaves(): string[] {
    return this.tree.length > 0 ? this.tree[0] : [];
  }

  getIndexForKey(key: string): number {
    return this.keys[key];
  }

  generateProof(level: number, idx: number, proof: string[] = []): string[] {
    if (level === this.tree.length - 1) {
      return proof;
    }

    const treeLevel = this.tree[level];
    const siblingIdx = idx + (isOdd(idx) ? -1 : +1);
    proof.push(treeLevel[siblingIdx]);

    return this.generateProof(level + 1, Math.floor(idx / 2), proof);
  }

  getProofForKey(key: string): string[] {
    return this.generateProof(0, this.getIndexForKey(key));
  }

  getRoot(timestamp?: number): string {
    const root = this.tree.length === 0 ? emptyRoot : this.tree[this.tree.length - 1][0];

    return timestamp === undefined ? root : SortedMerkleTree.squashRoot(root, timestamp);
  }

  extractRoot(root: string): string {
    return root.slice(0, SortedMerkleTree.SQUASHED_ROOT_SIZE);
  }

  verifyProof(proof: string[], root: string, leaf: string): boolean {
    let computedHash = leaf;

    proof.forEach((proofElement) => {
      if (computedHash <= proofElement) {
        computedHash = this.hashIt(computedHash, proofElement);
      } else {
        computedHash = this.hashIt(proofElement, computedHash);
      }
    });

    return computedHash === root || this.extractRoot(computedHash) === this.extractRoot(root);
  }

  static squashRoot(root: string, timestamp: number): string {
    return `${root.slice(0, SortedMerkleTree.SQUASHED_ROOT_SIZE)}${timestamp
      .toString(16)
      .padStart(64 - SortedMerkleTree.SQUASHED_ROOT_SIZE, '0')}`;
  }

  static flattenProofs(proofs: string[][]): { proofs: string; proofItemsCounter: number[] } {
    const proofItemsCounter: number[] = [];

    const flattened =
      '0x' +
      proofs
        .map((proof) => {
          proofItemsCounter.push(proof.length);
          return proof.map((item) => remove0x(item)).join('');
        })
        .join('');

    return { proofs: flattened, proofItemsCounter };
  }
}
