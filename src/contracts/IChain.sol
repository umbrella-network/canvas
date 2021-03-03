// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.0;

interface IChain {
  function blockPadding() external returns (uint256);

  function blocksCount() external returns (uint256);

  function getName() external pure returns (bytes32);

  function recoverSigner(bytes32 affidavit, uint8 _v, bytes32 _r, bytes32 _s) external pure returns (address);

  function getBlockHeight() external view returns (uint256);

  function getLeaderAddress() external view returns (address);

  function verifyProof(bytes32[] calldata _proof, bytes32 _root, bytes32 _leaf) external pure returns (bool);

  function hashLeaf(bytes calldata _key, bytes calldata _value) external pure returns (bytes32);

  function verifyProofForBlock(
    uint256 _blockHeight,
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
    uint256 _blockHeight,
    bytes32[] calldata _proof,
    bytes calldata _key,
    bytes calldata _value
  ) external returns (bool, uint256);

  function verifyProofForBlockForFloat(
    uint256 _blockHeight,
    bytes32[] calldata _proof,
    bytes calldata _key,
    bytes calldata _value
  ) external view returns (bool, uint256);

  function getBlockVotersCount(uint256 _blockHeight) external view returns (uint256);

  function getBlockVoters(uint256 _blockHeight) external view returns (address[] memory);

  function getBlockVotes(uint256 _blockHeight, address _voter) external view returns (uint256);

  function getSingleNumericData(uint256 _blockHeight, bytes32 _key) external view returns (uint256);

  function getMultipleNumericData(
    uint256 _blockHeight, bytes32[] calldata _keys
  ) external view returns (uint256[] memory data);
}
