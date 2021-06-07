import fs from 'fs';
import { Validator } from 'jsonschema';
import { loadAll } from 'js-yaml';
import axios from 'axios';

import Feeds from '../types/Feed';
import FeedsSchema from '../config/feeds-schema';

const urlCache = createUrlCache();

export default async function loadFeeds(filePath: string): Promise<Feeds> {
  try {
    new URL(filePath);

    return await processYaml(await urlCache.loadFromURL(filePath, true));
  } catch (err) {
    return await processYaml(await loadFromFile(filePath));
  }
}

async function processYaml(feedData: string, ignoreInvalid = true): Promise<Feeds> {
  const [feeds] = loadAll(feedData);
  const result = new Validator().validate(feeds, FeedsSchema);
  if (!result.valid) {
    if (!ignoreInvalid) {
      throw new Error(`Feeds validation error:\n${result.errors.map((err) => err.toString()).join('; ')}`);
    }

    result.errors.forEach((error) => {
      delete feeds[error.path[0]];
    });

    const updatedResult = new Validator().validate(feeds, FeedsSchema);
    if (!updatedResult.valid) {
      throw new Error(`Feeds validation error (pass 2):\n${result.errors.map((err) => err.toString()).join('; ')}`);
    }
  }

  return feeds;
}

async function loadFromFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', async (err, feedData) => {
      if (err) {
        reject(err);
      } else {
        resolve(feedData);
      }
    });
  });
}

function createUrlCache() {
  const etagCache: { [url: string]: string } = {};
  const dataCache: { [etag: string]: string } = {};

  return {
    loadFromURL: async (url: string, ignoreErrors = true): Promise<string> => {
      const etag = etagCache[url];
      const prevData = dataCache[etag];

      try {
        const response = await axios.get(url, {
          headers: { ...(etag ? { 'If-None-Match': etag } : {}) },
          validateStatus: function (status) {
            return status < 400;
          },
        });

        if (response.status === 304) {
          return prevData;
        } else if (response.status !== 200) {
          throw new Error(response.data);
        }

        if (response.data.Response === 'Error') {
          throw new Error(response.data.Message);
        }

        const { etag: nextEtag } = response.headers;

        etagCache[url] = nextEtag;
        dataCache[nextEtag] = response.data;

        return response.data;
      } catch (err) {
        if (ignoreErrors) {
          return prevData;
        }

        throw err;
      }
    },
  };
}
