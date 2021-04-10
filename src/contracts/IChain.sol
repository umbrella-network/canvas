// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.0;
pragma abicoder v2;

interface IChain {
  struct Block {
    bytes32 root;
    address minter;
    uint256 staked;
    uint256 power;
    uint256 anchor;
    uint256 timestamp;
    uint256 dataTimestamp;
  }

  function blockPadding() external view returns (uint256);

  function blocksCount() external view returns (uint256);

  function getName() external pure returns (bytes32);

  function recoverSigner(bytes32 affidavit, uint8 _v, bytes32 _r, bytes32 _s) external pure returns (address);

  function getStatus() external view returns (
    uint256 lastDataTimestamp,
    uint256 lastBlockId,
    address nextLeader,
    address[] memory validators,
    uint256[] memory powers,
    string[] memory locations,
    uint256 staked,
    bool readyForNextBlock
  );

  function getLatestBlockId() external view returns (uint256);

  function getLeaderIndex(uint256 numberOfValidators) external view returns (uint256);

  function getNextLeaderAddress() external view returns (address);
  
  function getLeaderAddress() external view returns (address);
  
  function getLeaderAddressAtBlock(uint256 ethBlockNumber) external view returns (address);

  function verifyProof(bytes32[] calldata _proof, bytes32 _root, bytes32 _leaf) external pure returns (bool);

  function hashLeaf(bytes calldata _key, bytes calldata _value) external pure returns (bytes32);

  function verifyProofForBlock(
    uint256 _blockId,
    bytes32[] calldata _proof,
    bytes calldata _key,
    bytes calldata _value
  ) external view returns (bool);

  function bytesToBytes32Array(
    bytes calldata _data,
    uint256 _offset,
    uint256 _items
  ) external pure returns (bytes32[] memory);

  function verifyProofs(
    uint256[] calldata _blockHeights,
    bytes calldata _proofs,
    uint256[] calldata _proofItemsCounter,
    bytes32[] calldata _leaves
  ) external view returns (bool[] memory results);
  
  function decodeLeafToNumber(bytes calldata _leaf) external pure returns (uint);

  function decodeLeafToFloat(bytes calldata _leaf) external pure returns (uint);

  function verifyProofForBlockForNumber(
    uint256 _blockId,
    bytes32[] calldata _proof,
    bytes calldata _key,
    bytes calldata _value
  ) external returns (bool, uint256);

  function verifyProofForBlockForFloat(
    uint256 _blockId,
    bytes32[] calldata _proof,
    bytes calldata _key,
    bytes calldata _value
  ) external view returns (bool, uint256);

  function getBlockData(uint256 _blockId) external view returns (Block memory);

  function getBlockRoot(uint256 _blockId) external view returns (bytes32);

  function getBlockMinter(uint256 _blockId) external view returns (address);

  function getBlockStaked(uint256 _blockId) external view returns (uint256);

  function getBlockPower(uint256 _blockId) external view returns (uint256);

  function getBlockAnchor(uint256 _blockId) external view returns (uint256);

  function getBlockTimestamp(uint256 _blockId) external view returns (uint256);

  function getBlockVotersCount(uint256 _blockId) external view returns (uint256);

  function getBlockVoters(uint256 _blockId) external view returns (address[] memory);

  function getBlockVotes(uint256 _blockId, address _voter) external view returns (uint256);

  function getNumericFCD(uint256 _blockId, bytes32 _key) external view returns (uint256 value, uint timestamp);

  function getNumericFCDs(
    uint256 _blockId, bytes32[] calldata _keys
  ) external view returns (uint256[] memory values, uint256 timestamp);

  function getCurrentValue(bytes32 _key) external view returns (uint256 value, uint timestamp);
}
