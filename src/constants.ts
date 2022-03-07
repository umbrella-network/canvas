import BigNumber from 'bignumber.js';

export const CHAIN_CONTRACT_NAME = 'Chain';

export const CHAIN_CONTRACT_NAME_BYTES32 = '0x436861696e000000000000000000000000000000000000000000000000000000';

export const NUMERIC_MULTIPLIER = 10 ** 18;

export const FIXED_NUMBER_PREFIX = 'FIXED_';

export const SIGNED_NUMBER_PREFIX = 'SN_';

export const MAX_UINT224_HEX = '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const MAX_UINT224_BN = new BigNumber(MAX_UINT224_HEX);

export const MAX_INT_224_BN = MAX_UINT224_BN.minus(1).div(2);

export const MIN_INT_224_BN = MAX_INT_224_BN.plus(1).times(-1);

