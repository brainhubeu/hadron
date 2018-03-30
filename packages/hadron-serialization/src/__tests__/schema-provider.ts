import { expect } from 'chai';
import * as jsonProvider from '../../../hadron-json-provider';
import schemaProvider from '../schema-provider';

describe('schemaProvider', () => {
  it('should try to locate files in given location', () => {
    const mockResponse = [
      { name: 'Test', properties: [] },
      { name: 'Second', properties: [] },
    ];

    const jsonProviderStub = sinon
      .stub(jsonProvider, 'default')
      .callsFake(() => Promise.resolve(mockResponse));

    const result = schemaProvider(['./test/location']);
    jsonProviderStub.restore();

    return expect(result).to.eventually.be.eql(mockResponse);
  });
});
