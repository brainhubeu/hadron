import { expect } from 'chai';
import locate, { configLocate } from '../file-locator';

describe('locate', () => {
  const packageDirPath = 'packages/hadron-file-locator/src/__tests__';

  it('should return an array', () => {
    return configLocate(['./mock/app/config/*'], 'config', 'development').then(
      (result) => {
        expect(result).to.be.an('array');
      },
    );
  });

  it('should return path files from mock/app/conifg/* with development type and js extension', () => {
    return configLocate(
      [`${packageDirPath}/mock/app/config/*`],
      'config',
      'development',
      ['JS'],
    ).then((result) => {
      expect(result).to.deep.equal([
        `${packageDirPath}/mock/app/config/config.js`,
        `${packageDirPath}/mock/app/config/config_development.js`,
      ]);
    });
  });

  it('should return path files from mock/app/config/* with development type and json extension', () => {
    return configLocate(
      [`${packageDirPath}/mock/app/config/*`],
      'config',
      'development',
      ['json'],
    ).then((result) => {
      expect(result).to.deep.equal([
        `${packageDirPath}/mock/app/config/config.json`,
        `${packageDirPath}/mock/app/config/config_development.json`,
      ]);
    });
  });

  it('should return path files from every folder in mock/plugins with config folder', () => {
    return configLocate(
      [`${packageDirPath}/mock/plugins/*/config/*`],
      'config',
      'development',
      ['js'],
    ).then((result) => {
      expect(result).to.deep.equal([
        `${packageDirPath}/mock/plugins/plugin1/config/config.js`,
        `${packageDirPath}/mock/plugins/plugin1/config/config_development.js`,
        `${packageDirPath}/mock/plugins/plugin2/config/config.js`,
        `${packageDirPath}/mock/plugins/plugin2/config/config_development.js`,
        `${packageDirPath}/mock/plugins/plugin3/config/config.js`,
        `${packageDirPath}/mock/plugins/plugin3/config/config_development.js`,
      ]);
    });
  });

  it('should return path files from mock/app/ext with js, json and xml extensions', () => {
    return configLocate(
      [`${packageDirPath}/mock/app/ext/*`],
      'config',
      'development',
      ['js', 'json', 'xml'],
    ).then((result) => {
      expect(result).to.deep.equal([
        `${packageDirPath}/mock/app/ext/config.js`,
        `${packageDirPath}/mock/app/ext/config.json`,
        `${packageDirPath}/mock/app/ext/config.xml`,
      ]);
    });
  });
});
