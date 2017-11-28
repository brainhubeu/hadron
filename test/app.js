import { expect } from 'chai';
import app from 'example/app';

describe('app', () => {
  it('should work', async function() {
    expect(app(), 'value is bad').to.be.deep.equal({ message: 'I\'m working' });
  });
});
