import { providers } from 'ethers';
import { isTimestampMoreRecentThan } from '../utils/helpers';

interface ComparandWithTimestamp {
  isUpToDate: boolean;
  url: string;
}

interface ComparandWithBlockNumber {
  blockNumber: number;
  url: string;
}

interface Config {
  timeout: number;
  maxTimestampDiff: number;
}

class RPCSelector {
  private readonly urls: string[];
  private readonly config: Config;

  constructor(urls: string | string[], config: Config = { timeout: 15000, maxTimestampDiff: 60000 }) {
    this.urls = typeof urls === 'string' ? urls.split(',') : urls;
    this.config = config;
  }

  public async selectByTimestamp(): Promise<string> {
    if (this.urls.length === 1) return this.urls[0];

    const timestamps = await Promise.all(this.getProvidersTimestamps());

    return this.getProviderWithUpToDateTimestamp(timestamps);
  }

  public async selectByLatestBlockNumber(): Promise<string> {
    if (this.urls.length === 1) return this.urls[0];

    const providerComparands = await Promise.all(this.getProviderComparands());

    return this.getProviderWithHighestBlockNumber(providerComparands);
  }

  private getProvidersTimestamps(): Promise<ComparandWithTimestamp>[] {
    return this.urls.map(async (url) => {
      try {
        const provider = providers.getDefaultProvider(url);
        const block = <{ timestamp: number }>await Promise.race([provider.getBlock('latest'), this.timeout()]);
        const isUpToDate = isTimestampMoreRecentThan(block.timestamp, this.config.maxTimestampDiff / 1000);
        return { url, isUpToDate };
      } catch {
        return { url, isUpToDate: false };
      }
    });
  }

  private getProviderWithUpToDateTimestamp(comparands: ComparandWithTimestamp[]): string {
    const { url } = comparands.find(({ isUpToDate }) => isUpToDate) || comparands[0];
    console.log(`[RPCSelector] Found highest block number on ${url}`);
    return url;
  }

  private getProviderComparands(): Promise<ComparandWithBlockNumber>[] {
    return this.urls.map(async (url) => {
      try {
        const provider = providers.getDefaultProvider(url);
        const blockNumber = await Promise.race([provider.getBlockNumber(), this.timeout()]);
        return { blockNumber: blockNumber || 0, url };
      } catch {
        return { blockNumber: 0, url };
      }
    });
  }

  private timeout(): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(reject, this.config.timeout, 'Took too long to fetch RPC data');
    });
  }

  private getProviderWithHighestBlockNumber(comparands: ComparandWithBlockNumber[]): string {
    const { url } = comparands.reduce((acc, cur) => (cur.blockNumber > acc.blockNumber ? cur : acc));
    console.log(`[RPCSelector] Found highest block number on ${url}`);
    return url;
  }
}

export { RPCSelector };
