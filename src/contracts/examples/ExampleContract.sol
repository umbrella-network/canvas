//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

//import "hardhat/console.sol";

import "../lib/ValueDecoder.sol";

// contract with examples for working with signed integers in solidity
contract ExampleContract {
    using ValueDecoder for uint224;
    using ValueDecoder for bytes;

    // example usage of ValueDecoder.toInt function
    // expects a signed integer encoded as a uint224
    function convertUintToInt(uint224 u) external pure returns (int256) {
        return u.toInt();
    }

    // example usage of ValueDecoder.toUint function
    // expects a int224 in raw bytes
    function convertIntToUInt(int224 i) external pure returns (uint224) {

        // first convert signed int input to bytes
        bytes memory b = new bytes(32);
        assembly { mstore(add(b, 32), i) }

        // convert to uint
        return uint224(b.toUint());
    }
}