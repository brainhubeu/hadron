import { expect } from 'chai';
import { jsLoader } from '../json-provider';

describe.only ('jsLoader', () => {
    it ('should return object', () => {
        return jsLoader('src/util/__tests__/mock/app/config/config.js').then(result => {
            expect(result).to.be.an.instanceof(Object);
        });
    });

    it ('load JavaScript file and return callback result', () => {
        return jsLoader('src/util/__tests__/mock/app/config/config.js').then(result => {
            expect(result).to.be.deep.equal({
                usernameJS: 'user-JS',
                emailJS: 'user-JS@email.com',
            });
        });
    });

    it ('should throw error if file path does not have a valid extension', () => {
        const path = 'src/util/__tests__/mock/app/config/config.json';
        return jsLoader(path).catch(error => {
            expect(error).to.be.an.instanceof(Error);
            expect(error.message).to.be.equal(`${path} don't have js extension`);
        });
    });
});
