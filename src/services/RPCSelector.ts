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

  constructor(urls: string | string[], rpcRequestTimeout = 15000) {
    this.urls = typeof urls === 'string' ? urls.split(',') : urls;
    this.preferredProviderUrl = this.urls[0];
    this.rpcRequestTimeout = rpcRequestTimeout;
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
    return isTimestampMoreRecentThan(block.timestamp, 60);
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

  private timeout(): void {
    setTimeout(() => {
      return Promise.reject('Took too long to fetch RPC data');
    }, this.rpcRequestTimeout);
  }

  private getMostUpToDateProvider(providers: ProviderComparand[]): string {
    const { url } = providers.reduce((acc, cur) => (acc.blockNumber > cur.blockNumber ? acc : cur));
    return url;
  }
}

export { RPCSelector };
