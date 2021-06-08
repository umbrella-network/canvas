export interface FeedFetcher {
  name: string;
  params?: unknown;
}

export interface FeedCalculator {
  name: string;
  params?: unknown;
}

export interface FeedInput {
  fetcher: FeedFetcher;
  calculator?: FeedCalculator;
}

export interface Feed {
  discrepancy: number;
  precision: number;
  inputs: FeedInput[];
}

export default interface Feeds {
  [leafLabel: string]: Feed;
  // eslint-disable-next-line
}
