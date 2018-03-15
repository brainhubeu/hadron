import { expect } from "chai";
import * as sinon from "sinon";
import { hasIntersection, serialize, serializeEntry } from "../serializer";
import { carConfiguration, fruitConfiguration, options } from "./mocks";

describe("serializer", () => {
    describe("hasIntersection", () => {
        it("should return true if at least one element is common for both arrays", () => {
            expect(hasIntersection([1, 2, 3], [3, 4, 5])).to.eql(true);
        });

        it("should return false if no elements are common for both arrays", () => {
            expect(hasIntersection([1, 2, 3], [4, 5, 6])).to.eql(false);
        });

        it("should return false if one of arrays are empty", () => {
            expect(hasIntersection([1, 2, 3], [])).to.eql(false);
        });
    });

    describe("serializeEntry()", () => {
        it("should run parse method for defined type", () => {
            const parsers = {
                number: sinon.spy(Number),
            };

            const property = {
                name: "price",
                type: "number",
             };

            serializeEntry("123", ["common"], property, parsers);
            expect(parsers.number.calledWith("123"));
        });

        it("should run parse method for defined type", () => {
            const parsers = {
                number: sinon.spy(Number),
            };

            const property = {
                name: "price",
                type: "number",
             };

            serializeEntry("123", ["common"], property, parsers);
            expect(parsers.number.calledWith("123"));
        });
    });

    describe("serialize()", () => {
        it("should exclude properties not belonging to configuration", () => {
            const data = {
                absent: "I shouldn't be here",
                name: "Civic",
                price: "12000",
                type: "hatchback",
            };
            expect(serialize(data, ["seller"], carConfiguration.properties, {})).to.not.contain.keys(["absent"]);
        });

        it("should include properties belonging to group", () => {
            const data = {
                name: "Civic",
                price: "12000",
                type: "hatchback",
            };
            expect(serialize(data, ["common"], carConfiguration.properties, {})).to.contain.keys(["name", "price"]);
        });

        it("should run parsers before returning value", () => {
            const data = {
                name: "Civic",
                price: "12000",
                type: "hatchback",
            };
            const parsers = { number: sinon.spy(Number) };
            serialize(data, ["common"], carConfiguration.properties, parsers);
            expect(parsers.number.calledWith("12000")).to.be.eql(true);
        });

        it("should include nested parameters", () => {
            const data = {
                flavour: {
                    bitterness: "2",
                    sweetness: "12",
                },
                name: "Pear",
                price: "20",
            };
            const result = serialize(data, ["common"], fruitConfiguration.properties, {});
            expect(result).to.have.property("flavour");
        });

        it("should parse nested parameters", () => {
            const data = {
                flavour: {
                    bitterness: "2",
                    sweetness: "12",
                },
                name: "Pear",
                price: "20",
            };
            const parsers = {
                number: sinon.spy(Number),
            };
            const result = serialize(data, ["common"], fruitConfiguration.properties, parsers);
            expect(parsers.number.calledThrice).to.eql(true);
        });

        it("should set key as defined serializedName", () => {
            const data = {
                _id: "12",
                flavour: {
                    bitterness: "2",
                    sweetness: "12",
                },
                name: "Pear",
                price: "20",
            };
            const result = serialize(data, ["common"], fruitConfiguration.properties, {});
            expect(result).to.have.property("ID");
        });
    });
});
