import { expect } from "chai";
import { jsonLoader } from "../json-provider";

describe.only ("jsonLoader", () => {
    const path = "src/util/__tests__/mock/app/config/config_development.json";

    it ("should return an object", () => {
        return jsonLoader(path).then((result) => {
            expect(result).to.be.an.instanceof(Object);
        });
    });

    it ("should return an object with proper values", () => {
        const obj = {
                status: "Development",
        };

        return jsonLoader(path).then((result) => {
            expect(result).to.be.deep.equal(obj);
        });
    });

    it ("should throw an error when extension is invalid", () => {
        return jsonLoader(`${path}x`).catch((error) => {
            expect(error).to.be.an.instanceof(Error);
            expect(error.message).to.be.equal(`${path}x don't have a json extension`);
        });
    });
});
