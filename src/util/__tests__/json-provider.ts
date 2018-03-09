import { expect } from 'chai';
import jsonProvider from '../json-provider';

describe.only ('jsonProvider', () => {
    it ('should return object', () => {
        return jsonProvider(['src/util/__tests__/mock/app/config/*'], 'config', 'development', ['js'])
        .then(result => {
            expect(result).to.be.an.instanceof(Object);
        });
    });

    it ('should return JavaScript object with proper values', () => {
        const obj = { 
            usernameJS: 'user-JS',
            emailJS: 'user-JS@email.com',
            name: 'module - x'
        }

        return jsonProvider(['src/util/__tests__/mock/app/config/*'], 'config', 'development', ['js'])
        .then(result => {
            expect(result).to.be.deep.equal(obj);
        });
    });

    it ('should return JavaScript object from json and xml files', () => {
        const obj = {
            status: "Test",
            database: {
                host: "default",
                user: "default",
                password: "default"
            }
        }

        return jsonProvider(['src/util/__tests__/mock/app/config/*'], 'config', 'development', ['json', 'xml'])
        .then(result => {
            expect(result).to.be.deep.equal(obj);
        });
    });

    it ('should return JavaScript object from json and js files', () => {
        const obj = {
            status: "Development",
            database: {
                host: "default",
                user: "default",
                password: "default"
            },
            usernameJS: "user-JS",
            emailJS: "user-JS@email.com",
            name: "module - x"
        }

        return jsonProvider(['src/util/__tests__/mock/app/config/*'], 'config', 'development', ['json', 'js'])
        .then(result => {
            expect(result).to.be.deep.equal(obj);
        });
    });
});
