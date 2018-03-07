import { expect } from 'chai';

import locate from '../file-locator';

describe.only ('locate', () => {
    it ('should return an array', () => {
        return locate(['src/util/__tests__/mock/app/config/*'], 'config', 'development').then(result => {
            expect(result).to.be.an('array');
        });
    });

    it ('should return path files from mock/app/conifg/* with development type and js extension', () => {
        return locate(['src/util/__tests__/mock/app/config/*'], 'config', 'development', ['js']).then(result => {
            expect(result).to.have.deep.members(['src/util/__tests__/mock/app/config/config.js', 'src/util/__tests__/mock/app/config/config_development.js']);
        });
    });

    it ('should return path files from mock/app/config/* with development type and ts extension', () => {
        return locate(['src/util/__tests__/mock/app/config/*'], 'config', 'development', ['ts']).then(result => {
            expect(result).to.have.deep.members(['src/util/__tests__/mock/app/config/config.ts']);
        });
    });

    it ('should return path files from every folder in mock/plugins with config folder', () => {
        return locate(['src/util/__tests__/mock/plugins/*/config/*'], 'config', 'development').then(result => {
            expect(result).to.have.deep.members([
                'src/util/__tests__/mock/plugins/plugin1/config/config_development.js',
                'src/util/__tests__/mock/plugins/plugin1/config/config.js',
                'src/util/__tests__/mock/plugins/plugin1/config/config_development.ts',
                'src/util/__tests__/mock/plugins/plugin2/config/config_development.js',
                'src/util/__tests__/mock/plugins/plugin2/config/config.js',
                'src/util/__tests__/mock/plugins/plugin3/config/config.js',
                'src/util/__tests__/mock/plugins/plugin3/config/config_development.js'
            ]);
        });
    });

    it ('should return path files from mock/app/ext with js, json and xml extensions', () => {
        return locate(['src/util/__tests__/mock/app/ext/*'], 'config', 'development', ['js', 'json', 'xml']).then(result => {
            expect(result).to.have.deep.members([
                'src/util/__tests__/mock/app/ext/config.js',
                'src/util/__tests__/mock/app/ext/config.json',
                'src/util/__tests__/mock/app/ext/config.xml',
            ]);
        });
    });
});
