/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as SDK from '../../src';
import moxios from 'moxios';
import blocksResponse from '../fixtures/blocks-response.json';
import {expect} from 'chai';

describe('APIClient()', () => {
  it('expect to instantiate', () => {
    new SDK.API.APIClient({ baseURL: 'http://localhost:3003', apiKey: 'xxx' });
  });

  let client: SDK.API.APIClient;

  beforeEach(() => {
    client = new SDK.API.APIClient({ baseURL: 'http://localhost:3003', apiKey: 'xxx' });
    // @ts-ignore
    moxios.install(client['axios']);
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('#getBlocks', () => {
    it('expect to work', async () => {
      moxios.stubRequest('/blocks', {
        response: blocksResponse
      });

      const blocks = await client.getBlocks();
      expect(blocks).be.an('array');

      blocks.forEach((block) => {
        expect(block).be.an('object');
        expect(block).to.have.property('_id').that.is.a('string');
      });
    });
  });
});
