import { JsonRpcProvider, Block } from '@ethersproject/providers';

interface ProviderComparand {
  blockNumber: number;
  url: string;
}

class RPCSelector {
  readonly urls: string[];
  readonly preferredProviderUrl: string;

  constructor(urls: string | string[]) {
    if (typeof urls === 'string') {
      this.urls = urls.split(',');
    } else {
      this.urls = urls;
    }

    this.preferredProviderUrl = this.urls[0];
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
      const block = await provider.getBlock('latest');
      return this.isBlockRecentlyMinted(block);
    } catch (e) {
      return false;
    }
  }

  private isBlockRecentlyMinted(block: Block): boolean {
    const currentDateInSeconds = Math.floor(Date.now() / 1000),
      oneMinute = 60;
    return block.timestamp - (currentDateInSeconds - oneMinute) <= oneMinute;
  }

  private getProviders(providersURLs: string[]): Promise<ProviderComparand>[] {
    return providersURLs.map(async (url) => {
      try {
        const provider = new JsonRpcProvider(url);
        const blockNumber = await provider.getBlockNumber();
        return { blockNumber, url };
      } catch (e) {
        return { blockNumber: 0, url };
      }
    });
  }

  private getMostUpToDateProvider(providers: ProviderComparand[]): string {
    const { url } = providers.reduce((acc, cur) => (acc.blockNumber > cur.blockNumber ? acc : cur));
    return url;
  }
}

export { RPCSelector };
