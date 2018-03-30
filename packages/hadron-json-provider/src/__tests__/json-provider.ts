import { expect } from 'chai';
import jsonProvider from '../json-provider';

describe('jsonProvider', () => {
  const mockDirPath = 'packages/hadron-json-provider/src/__tests__';
  it("should return object from config files, supports custom paths (like 'config.js')", () => {
    const finalObject = {
      dogName: 'Rex',
      teamName: 'team1',
      userName: 'user1',
    };

    return jsonProvider(
      [`${mockDirPath}/mock/app/universal/*`],
      ['config.js'],
    ).then((object) => {
      expect(object).to.be.deep.equal(finalObject);
    });
  });

  it('should return empty object if files do not exists', () => {
    return jsonProvider(['a/b/c'], ['js']).then((data) =>
      expect(data).to.be.deep.equal({}),
    );
  });

  it('should combine configurations from different extensions', () => {
    const finalObject = {
      dogName: 'Rex',
      fromJSON: true,
      teamName: 'team1',
      userName: 'user1',
    };

    return jsonProvider(
      [`${mockDirPath}/mock/app/universal/*`],
      ['config.js', 'json'],
    ).then((object) => {
      expect(object).to.be.deep.equal(finalObject);
    });
  });
});
