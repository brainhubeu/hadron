import { expect } from "chai";
import jsonProvider from "../json-provider";

describe.only ("jsonProvider", () => {
    it ("should return object", () => {
        return jsonProvider(["src/util/__tests__/mock/app/config/*"], "config", "development", ["js"])
        .then((result) => {
            expect(result).to.be.an.instanceof(Object);
        });
    });

    it ("should return JavaScript object with proper values", () => {
        const obj = {
            emailJS: "user-JS@email.com",
            name: "module - x",
            usernameJS: "user-JS",
        };

        return jsonProvider(["src/util/__tests__/mock/app/config/*"], "config", "development", ["js"])
        .then((result) => {
            expect(result).to.be.deep.equal(obj);
        });
    });

    it ("should return JavaScript object from json and xml files", () => {
        const obj = {
            database: {
                host: "default",
                password: "default",
                user: "default",
            },
            status: "Test",
        };

        return jsonProvider(["src/util/__tests__/mock/app/config/*"], "config", "development", ["json", "xml"])
        .then((result) => {
            expect(result).to.be.deep.equal(obj);
        });
    });

    it ("should return JavaScript object from json and js files", () => {
        const obj = {
            database: {
                host: "default",
                password: "default",
                user: "default",
            },
            emailJS: "user-JS@email.com",
            name: "module - x",
            status: "Development",
            usernameJS: "user-JS",
        };

        return jsonProvider(["src/util/__tests__/mock/app/config/*"], "config", "development", ["json", "js"])
        .then((result) => {
            expect(result).to.be.deep.equal(obj);
        });
    });
});
