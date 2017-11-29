import { expect } from 'chai';
import appController from '../app.controller';

describe('app controller', () => {
  it('should work', async function() {
    expect(appController.get(), 'value is bad').to.be.deep.equal({ foo: 'bar' });
  });
});
