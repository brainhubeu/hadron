import { expect } from "chai";
import { jsLoader } from "../json-provider";

describe ("jsLoader", () => {
    it ("should return object", () => {
        return jsLoader("src/util/__tests__/mock/app/config/config.js").then((result) => {
            expect(result).to.be.an.instanceof(Object);
        });
    });

    it ("load JavaScript file and return callback result", () => {
        return jsLoader("src/util/__tests__/mock/app/config/config.js").then((result) => {
            expect(result).to.be.deep.equal({
                emailJS: "user-JS@email.com",
                usernameJS: "user-JS",
            });
        });
    });

    it ("should throw error if file path doesn't have a valid extension", () => {
        const path = "src/util/__tests__/mock/app/config/config.json";
        return jsLoader(path).catch((error) => {
            expect(error).to.be.an.instanceof(Error);
            expect(error.message).to.be.equal(`${path} doesn't have js extension`);
        });
    });
});
