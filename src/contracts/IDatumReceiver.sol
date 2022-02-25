//SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "../lib/PassportStructs.sol";

interface IDatumReceiver {
  /// @notice This function will hold the parameters or business rules that consumer
  /// wants to do with the received data structure, here called Pallet.
  /// @param _pallet the structure sent by DatumRegistry, containing proof, key and value
  function receivePallet(Pallet calldata _pallet) external;

  /// @notice This function holds rules that consumer may need to check before accepting
  /// the Pallet. Rules like how old is the block, or how many blocks have passed since 
  /// last storage. Deliverer will check if approvePallet reverted this call or returned true.
  /// @param _pallet The exact same Pallet that will arrive at the receivePallet endpoint.
  /// @return true if wants pallet or should REVERT if Contract does not want the pallet.
  /// @dev DO NOT RETURN false.
  function approvePallet(Pallet calldata _pallet) external view returns (bool);
}
