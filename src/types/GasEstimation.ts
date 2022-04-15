import { FeeData } from '@ethersproject/abstract-provider';

type TxType2GasEstimation = {
  baseFeePerGas: number;
  gasPrice: number;
  maxPriorityFeePerGas?: number;
  maxFeePerGas?: number;
};

export interface GasEstimation extends TxType2GasEstimation {
  isTxType2: boolean;
  min: number;
  max: number;
  avg: number;
}

export type EstimateParams = {
  currentGasPrice: number;
  feeData: FeeData;
  minGasPrice: number;
  maxGasPrice: number;
  metrics: GasEstimation;
  prices: number[];
  maxPriorityFees: number[];
};
