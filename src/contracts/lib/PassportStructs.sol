// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

struct Datum {
  address receiver;
  bytes32[] keys;
  address funder;
  uint128 balance;
  bool enabled;
}

struct Pallet {
  uint32 blockId;
  bytes32 key;
  bytes32 value;
  bytes32[] proof; 
}

struct Delivery {
  bytes32 datumId;
  uint256[] indexes;
}
