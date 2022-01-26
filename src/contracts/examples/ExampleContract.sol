//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

//import "hardhat/console.sol";

import "../lib/ValueDecoder.sol";

// contract with examples for working with signed integers in solidity
contract ExampleContract {
    using ValueDecoder for uint224;
    using ValueDecoder for bytes;

    // declaration of signed integers
    int256 public MAX_SIGNED_INT = type(int256).max;
    int256 public MIN_SIGNED_INT = type(int256).min;
    int256 public ROOT = 240615969168004511545033772477625056927;

    // examples of basic operations with signed int's demonstrating overflow conditions

    function add(int256 a, int256 b) public view returns (int256) {
        if(a > 0 && b > 0) {
            require(a <= MAX_SIGNED_INT - b, "will overflow max signed int");
        } else if(a < 0 && b < 0) {
            require(a >= MIN_SIGNED_INT - b, "will overflow min signed int");
        }
        return a + b;
    }

    function sub(int256 a, int256 b) public view returns (int256) {
        if(a > 0 && b < 0) {
            require(a <= MAX_SIGNED_INT + b, "will overflow max signed int");
        } else if(a < 0 && b > 0) {
            require(a >= MIN_SIGNED_INT + b, "will overflow min signed int");
        }
        return a - b;
    }

    function mul(int256 a, int256 b) public view returns (int256) {
        if(abs(a) >= ROOT) {
            require(abs(b) <= MAX_SIGNED_INT / abs(a), "will overflow: a");
        } else if(abs(b) >= ROOT) {
            require(abs(a) <= MAX_SIGNED_INT / abs(b), "will overflow: b");
        }
        return a * b;
    }

    function div(int256 a, int256 b) public pure returns (int256) {
        require(b != 0, "cannot divide by zero");
        return a / b;
    }

    function square(int256 a) public view returns (int256) {
        require(abs(a) <= ROOT, "will overflow");
        return a * a;
    }

    function abs(int256 x) public pure returns (int256) {
        return x >= 0 ? x : -x;
    }

    // example usage of ValueDecoder.toInt function
    // expects a signed integer encoded as a uint224
    function convertUintToInt(uint224 u) external pure returns (int256) {
        return u.toInt();
    }

    // example usage of ValueDecoder.toUint function
    // expects a int256 in raw bytes
    function convertIntToUInt(int224 i) external pure returns (uint224) {

        // first convert signed int input to bytes
        bytes memory b = new bytes(32);
        assembly { mstore(add(b, 32), i) }

        // convert to uint
        return uint224(b.toUint());
    }
}