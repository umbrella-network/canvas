//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

//import "hardhat/console.sol";

import "../lib/ValueDecoder.sol";

// contract with examples for working with signed integers in solidity
contract ExampleContract {
    using ValueDecoder for uint224;

    // example usage of ValueDecoder.toInt function
    // expects a signed integer encoded as a uint224
    function convertUintToInt(uint224 u) external pure returns (int256) {
        return u.toInt();
    }
}

