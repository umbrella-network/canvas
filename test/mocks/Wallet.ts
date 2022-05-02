/*
 * Had to create this class because stubbing
 * ethers' "Wallet" is impossible due to the immutability
 * of the class.
 */

interface TransactionReceipt {
  status: number;
}

interface TransactionResponse {
  wait: () => Promise<TransactionReceipt>;
}

export class Wallet {
  public provider!: unknown;

  constructor(provider?: unknown) {
    this.provider = provider;
  }

  async getTransactionCount(): Promise<number> {
    return 1000;
  }

  async sendTransaction(): Promise<TransactionResponse> {
    return {
      wait: () => Promise.resolve({ status: 1 }),
    };
  }
}
