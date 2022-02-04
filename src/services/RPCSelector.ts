import { JsonRpcProvider, Block } from '@ethersproject/providers';
import { isTimestampMoreRecentThan } from '../utils/helpers';

interface ProviderComparand {
  blockNumber: number;
  url: string;
}

class RPCSelector {
  readonly urls: string[];
  readonly preferredProviderUrl: string;
  readonly rpcRequestTimeout: number;
  readonly maxBlockAge: number;

  constructor(urls: string | string[], rpcRequestTimeout = 15000, maxBlockAge = 60) {
    this.urls = typeof urls === 'string' ? urls.split(',') : urls;
    this.preferredProviderUrl = this.urls[0];
    this.rpcRequestTimeout = rpcRequestTimeout;
    this.maxBlockAge = maxBlockAge;
  }

  async apply(): Promise<string> {
    if (this.urls.length === 1 || (await this.isPreferredProviderUpToDate())) {
      return this.preferredProviderUrl;
    } else {
      const providers = await Promise.all(this.getProviders(this.urls.slice(1)));
      return this.getMostUpToDateProvider(providers);
    }
  }

  private async isPreferredProviderUpToDate(): Promise<boolean> {
    try {
      const provider = new JsonRpcProvider(this.preferredProviderUrl);
      const block = await Promise.race([provider.getBlock('latest'), this.timeout()]);
      return this.isBlockRecentlyMinted(block as Block);
    } catch (e) {
      return false;
    }
  }

  private isBlockRecentlyMinted(block: Block): boolean {
    return isTimestampMoreRecentThan(block.timestamp, this.maxBlockAge);
  }

  private getProviders(providersURLs: string[]): Promise<ProviderComparand>[] {
    return providersURLs.map(async (url) => {
      try {
        const provider = new JsonRpcProvider(url);
        const blockNumber = await Promise.race([provider.getBlockNumber(), this.timeout()]);
        return { blockNumber: blockNumber || 0, url };
      } catch (e) {
        return { blockNumber: 0, url };
      }
    });
  }

  private timeout(): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(reject, this.rpcRequestTimeout, 'Took too long to fetch RPC data');
    });
  }

  private getMostUpToDateProvider(providers: ProviderComparand[]): string {
    const { url } = providers.reduce((acc, cur) => (acc.blockNumber > cur.blockNumber ? acc : cur));
    return url;
  }
}

export { RPCSelector };