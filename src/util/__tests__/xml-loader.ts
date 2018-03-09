import { expect } from 'chai';
import { xmlLoader } from '../json-provider';

describe.only ('xmlLoader', () => {
    const path = 'src/util/__tests__/mock/app/config/config.xml';

    it ('should return object', () => {
        return xmlLoader(path).then(result => {
            expect(result).to.be.an.instanceof(Object);
        });
    });

    it ('load XML file and return callback result', () => {
        return xmlLoader(path).then(result => {
            expect(result).to.be.deep.equal({
                status: "Test"
            });
        });
    });

    it ('should throw error if file path does not have a valid extension', () => {
        return xmlLoader(`${path}x`).catch(error => {
            expect(error).to.be.an.instanceof(Error);
            expect(error.message).to.be.equal(`${path}x don't have xml extension`);
        });
    });
})
