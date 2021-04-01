export const chainAbi = [
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_contractRegistry',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': '_blockPadding',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'constructor'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'executor',
        'type': 'address'
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'blockPadding',
        'type': 'uint256'
      }
    ],
    'name': 'LogBlockPadding',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'minter',
        'type': 'address'
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'blockHeight',
        'type': 'uint256'
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'anchor',
        'type': 'uint256'
      }
    ],
    'name': 'LogMint',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address'
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address'
      }
    ],
    'name': 'OwnershipTransferred',
    'type': 'event'
  },
  {
    'inputs': [],
    'name': 'ETH_PREFIX',
    'outputs': [
      {
        'internalType': 'bytes',
        'name': '',
        'type': 'bytes'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'blockPadding',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'name': 'blocks',
    'outputs': [
      {
        'components': [
          {
            'internalType': 'bytes32',
            'name': 'root',
            'type': 'bytes32'
          },
          {
            'internalType': 'address',
            'name': 'minter',
            'type': 'address'
          },
          {
            'internalType': 'uint256',
            'name': 'staked',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'power',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'anchor',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'timestamp',
            'type': 'uint256'
          }
        ],
        'internalType': 'struct Chain.Block',
        'name': 'data',
        'type': 'tuple'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'blocksCount',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'blocksCountOffset',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes',
        'name': '_data',
        'type': 'bytes'
      },
      {
        'internalType': 'uint256',
        'name': '_offset',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': '_items',
        'type': 'uint256'
      }
    ],
    'name': 'bytesToBytes32Array',
    'outputs': [
      {
        'internalType': 'bytes32[]',
        'name': '',
        'type': 'bytes32[]'
      }
    ],
    'stateMutability': 'pure',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'contractRegistry',
    'outputs': [
      {
        'internalType': 'contract IRegistry',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes',
        'name': '_leaf',
        'type': 'bytes'
      }
    ],
    'name': 'decodeLeafToFloat',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'pure',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes',
        'name': '_leaf',
        'type': 'bytes'
      }
    ],
    'name': 'decodeLeafToNumber',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'pure',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockAnchor',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockData',
    'outputs': [
      {
        'components': [
          {
            'internalType': 'bytes32',
            'name': 'root',
            'type': 'bytes32'
          },
          {
            'internalType': 'address',
            'name': 'minter',
            'type': 'address'
          },
          {
            'internalType': 'uint256',
            'name': 'staked',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'power',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'anchor',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'timestamp',
            'type': 'uint256'
          }
        ],
        'internalType': 'struct Chain.Block',
        'name': '',
        'type': 'tuple'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'getBlockHeight',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockMinter',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockPower',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockRoot',
    'outputs': [
      {
        'internalType': 'bytes32',
        'name': '',
        'type': 'bytes32'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockStaked',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockTimestamp',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockVoters',
    'outputs': [
      {
        'internalType': 'address[]',
        'name': '',
        'type': 'address[]'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      }
    ],
    'name': 'getBlockVotersCount',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      },
      {
        'internalType': 'address',
        'name': '_voter',
        'type': 'address'
      }
    ],
    'name': 'getBlockVotes',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes32',
        'name': '_key',
        'type': 'bytes32'
      }
    ],
    'name': 'getCurrentValue',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'timestamp',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'getLatestBlockHeightWithData',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'getLeaderAddress',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'ethBlockNumber',
        'type': 'uint256'
      }
    ],
    'name': 'getLeaderAddressAtBlock',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'numberOfValidators',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'ethBlockNumber',
        'type': 'uint256'
      }
    ],
    'name': 'getLeaderIndex',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'getName',
    'outputs': [
      {
        'internalType': 'bytes32',
        'name': '',
        'type': 'bytes32'
      }
    ],
    'stateMutability': 'pure',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'getNextLeaderAddress',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32',
        'name': '_key',
        'type': 'bytes32'
      }
    ],
    'name': 'getNumericFCD',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'timestamp',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_keys',
        'type': 'bytes32[]'
      }
    ],
    'name': 'getNumericFCDs',
    'outputs': [
      {
        'internalType': 'uint256[]',
        'name': 'values',
        'type': 'uint256[]'
      },
      {
        'internalType': 'uint256',
        'name': 'timestamp',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes',
        'name': '_key',
        'type': 'bytes'
      },
      {
        'internalType': 'bytes',
        'name': '_value',
        'type': 'bytes'
      }
    ],
    'name': 'hashLeaf',
    'outputs': [
      {
        'internalType': 'bytes32',
        'name': '',
        'type': 'bytes32'
      }
    ],
    'stateMutability': 'pure',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes32',
        'name': 'affidavit',
        'type': 'bytes32'
      },
      {
        'internalType': 'uint8',
        'name': '_v',
        'type': 'uint8'
      },
      {
        'internalType': 'bytes32',
        'name': '_r',
        'type': 'bytes32'
      },
      {
        'internalType': 'bytes32',
        'name': '_s',
        'type': 'bytes32'
      }
    ],
    'name': 'recoverSigner',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'pure',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockPadding',
        'type': 'uint256'
      }
    ],
    'name': 'setBlockPadding',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'stakingBankContract',
    'outputs': [
      {
        'internalType': 'contract IStakingBank',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes32',
        'name': '_root',
        'type': 'bytes32'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_keys',
        'type': 'bytes32[]'
      },
      {
        'internalType': 'uint256[]',
        'name': '_values',
        'type': 'uint256[]'
      },
      {
        'internalType': 'uint8[]',
        'name': '_v',
        'type': 'uint8[]'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_r',
        'type': 'bytes32[]'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_s',
        'type': 'bytes32[]'
      }
    ],
    'name': 'submit',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'tokenContract',
    'outputs': [
      {
        'internalType': 'contract ERC20',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address'
      }
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'validatorRegistryContract',
    'outputs': [
      {
        'internalType': 'contract IValidatorRegistry',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'bytes32[]',
        'name': '_proof',
        'type': 'bytes32[]'
      },
      {
        'internalType': 'bytes32',
        'name': '_root',
        'type': 'bytes32'
      },
      {
        'internalType': 'bytes32',
        'name': '_leaf',
        'type': 'bytes32'
      }
    ],
    'name': 'verifyProof',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'pure',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_proof',
        'type': 'bytes32[]'
      },
      {
        'internalType': 'bytes',
        'name': '_key',
        'type': 'bytes'
      },
      {
        'internalType': 'bytes',
        'name': '_value',
        'type': 'bytes'
      }
    ],
    'name': 'verifyProofForBlock',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_proof',
        'type': 'bytes32[]'
      },
      {
        'internalType': 'bytes',
        'name': '_key',
        'type': 'bytes'
      },
      {
        'internalType': 'bytes',
        'name': '_value',
        'type': 'bytes'
      }
    ],
    'name': 'verifyProofForBlockForFloat',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      },
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_blockHeight',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_proof',
        'type': 'bytes32[]'
      },
      {
        'internalType': 'bytes',
        'name': '_key',
        'type': 'bytes'
      },
      {
        'internalType': 'bytes',
        'name': '_value',
        'type': 'bytes'
      }
    ],
    'name': 'verifyProofForBlockForNumber',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      },
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256[]',
        'name': '_blockHeights',
        'type': 'uint256[]'
      },
      {
        'internalType': 'bytes',
        'name': '_proofs',
        'type': 'bytes'
      },
      {
        'internalType': 'uint256[]',
        'name': '_proofItemsCounter',
        'type': 'uint256[]'
      },
      {
        'internalType': 'bytes32[]',
        'name': '_leaves',
        'type': 'bytes32[]'
      }
    ],
    'name': 'verifyProofs',
    'outputs': [
      {
        'internalType': 'bool[]',
        'name': 'results',
        'type': 'bool[]'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  }
];
