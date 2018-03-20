import { expect } from 'chai';
import { jsonLoader } from '../json-provider';

describe('jsonLoader', () => {
  const path = 'packages/hadron-json-provider/src/__tests__/mock/app/config/config_development.json';

  it('should return an object', () => {
    return jsonLoader(path).then(result => {
      expect(result).to.be.an.instanceof(Object);
    });
  });

  it('load json file and return callback result', () => {
    return jsonLoader(path).then(result => {
      expect(result).to.be.deep.equal({
        status: 'Development',
      });
    });
  });

  it('should throw an error when extension is invalid', () => {
    return jsonLoader(`${path}x`).catch(error => {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.be.equal(`${path}x doesn't have a json extension`);
    });
  });
});
