import { Wallet } from 'ethers';
import { TransactionResponse, TransactionReceipt, TransactionRequest } from '@ethersproject/providers';
import { GasEstimator } from './GasEstimator';
import { GasEstimation } from '../types/GasEstimation';
import { sleep } from '../utils/sleep';

interface Props {
  wallet: Wallet;
  chainId: string;
  waitForBlockTime?: number;
}

enum ReceiptStatus {
  SUCCESSFUL = 1,
  REVERTED = 0,
}

export class TxSender {
  readonly wallet!: Wallet;
  readonly chainId!: string;
  readonly waitForBlockTime: number = 500;

  constructor(props: Props) {
    this.wallet = props.wallet;
    this.waitForBlockTime = props.waitForBlockTime || 500;
    this.chainId = props.chainId;
  }

  public async apply(
    fn: (tr: TransactionRequest) => Promise<TransactionResponse>,
    minGasPrice: number,
    maxGasPrice: number,
    timeoutSec: number,
    transactionRequest: TransactionRequest = {}
  ): Promise<TransactionReceipt> {
    console.log(`[${this.chainId}] submitting tx`);

    const gasEstimation = await GasEstimator.apply(this.wallet.provider, minGasPrice, maxGasPrice);
    const { gasPrice, maxPriorityFeePerGas, maxFeePerGas, isTxType2 } = gasEstimation;

    const gas = {
      type: isTxType2 ? 2 : 0,
      gasPrice: isTxType2 ? undefined : gasPrice,
      maxPriorityFeePerGas: isTxType2 ? maxPriorityFeePerGas : undefined,
      maxFeePerGas: isTxType2 ? maxFeePerGas : undefined,
    };

    console.log(`[${this.chainId}] gas metrics: ${GasEstimator.printable(gasEstimation)}`);

    const { tx, receipt, timeoutMs } = await this.executeTx(fn, { ...gas, ...transactionRequest }, timeoutSec * 1000);

    if (!receipt) {
      console.log(`[${this.chainId}] canceling tx ${tx.hash}`);
      const newGasMetrics = await GasEstimator.apply(this.wallet.provider, minGasPrice, maxGasPrice);

      await this.cancelPendingTransaction(gasEstimation.gasPrice, timeoutSec, newGasMetrics);

      throw new Error(`[${this.chainId}] mint TX timeout: ${timeoutMs}ms`);
    }

    return receipt;
  }

  private async cancelPendingTransaction(
    prevGasPrice: number,
    timePadding: number,
    gasEstimation: GasEstimation
  ): Promise<void> {
    const { isTxType2 } = gasEstimation;
    const maxPriorityFeePerGas = isTxType2 ? Math.ceil(gasEstimation.maxPriorityFeePerGas || 0 * 1.5) : undefined;
    const higherGasPrice = Math.max(gasEstimation.gasPrice, prevGasPrice) * 2;
    // maxFeePerGas can not be less than maxPriorityFeePerGas
    const maxFeePerGas = isTxType2 ? Math.max(higherGasPrice, maxPriorityFeePerGas || 0 + 1) : undefined;

    const txData = <TransactionRequest>{
      from: this.wallet.address,
      to: this.wallet.address,
      value: 0n,
      nonce: await this.wallet.getTransactionCount('latest'),
      gasLimit: 21000,
      gasPrice: isTxType2 ? undefined : higherGasPrice,
      maxPriorityFeePerGas,
      maxFeePerGas,
    };

    console.log(`[${this.chainId}] sending canceling tx, nonce: ${txData.nonce}, gasPrice: ${higherGasPrice}`);

    const fn = (tr: TransactionRequest) => this.wallet.sendTransaction(tr);

    let tx, receipt;

    try {
      ({ tx, receipt } = await this.executeTx(fn, txData, timePadding * 1000));
    } catch (e) {
      if ((<Error>e).message.includes('replacement fee too low')) {
        const evenHigherGasPrice = higherGasPrice * 2;

        const newTxData = <TransactionRequest>{
          ...txData,
          gasPrice: isTxType2 ? undefined : evenHigherGasPrice,
          maxFeePerGas: isTxType2 ? evenHigherGasPrice : undefined,
        };

        console.log(
          `[${this.chainId}] re-sending canceling tx, nonce: ${txData.nonce}, gasPrice: ${evenHigherGasPrice}`
        );
        ({ tx, receipt } = await this.executeTx(fn, newTxData, timePadding * 1000));
      } else {
        throw e;
      }
    }

    if (receipt?.status === ReceiptStatus.SUCCESSFUL) {
      console.log(`[${this.chainId}] canceling tx ${tx.hash}: filed or still pending`);
    }
  }

  private async waitUntilNextBlock(currentBlockNumber: number): Promise<number> {
    // it would be nice to subscribe for blockNumber, but we forcing http for RPC
    // this is not pretty solution, but we using proxy, so infura calls should not increase
    let newBlockNumber = await this.wallet.provider.getBlockNumber();

    while (currentBlockNumber === newBlockNumber) {
      console.log(`[${this.chainId}] waitUntilNextBlock: current ${currentBlockNumber}, new ${newBlockNumber}.`);
      await sleep(this.waitForBlockTime);
      newBlockNumber = await this.wallet.provider.getBlockNumber();
    }

    return newBlockNumber;
  }

  private async executeTx(
    fn: (tr: TransactionRequest) => Promise<TransactionResponse>,
    transactionRequest: TransactionRequest,
    timeoutMs: number
  ): Promise<{ tx: TransactionResponse; receipt: TransactionReceipt | undefined; timeoutMs: number }> {
    const [currentBlockNumber, tx] = await Promise.all([this.wallet.provider.getBlockNumber(), fn(transactionRequest)]);

    // there is no point of doing any action on tx if block is not minted
    const newBlockNumber = await this.waitUntilNextBlock(currentBlockNumber);

    console.log(`[${this.chainId}] new block detected ${newBlockNumber}, waiting for tx to be minted.`);

    return { tx, receipt: await Promise.race([tx.wait(), TxSender.txTimeout(timeoutMs)]), timeoutMs };
  }

  private static async txTimeout(timeout: number): Promise<undefined> {
    return new Promise<undefined>((resolve) =>
      setTimeout(async () => {
        resolve(undefined);
      }, timeout)
    );
  }
}
