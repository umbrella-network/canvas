import {APIClient} from '../../src';

describe('APIClient()', () => {
  it('expect to instantiate', () => {
    new APIClient({ baseURL: 'http://localhost:3003', apiKey: 'xxx' });
  });
});
