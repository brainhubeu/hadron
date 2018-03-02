import { expect } from "chai";
import containerItem from "../ContainerItem";

describe("set lifetime", () => {
    it("should be default(transient)", () => {
        const item = new containerItem("object", Object);
        expect(item.Lifetime).to.equal(0);
    });
    it("should be transient", () => {
        const item = new containerItem("object", Object);
        item.AsTransient();
        expect(item.Lifetime).to.equal(0);
    });
    it("should be singletone", () => {
        const item = new containerItem("object", Object);
        item.AsSingletone();
        expect(item.Lifetime).to.equal(1);
    });
  });
describe("set value", () => {
    it("should return 1", () => {
        const item = new containerItem("number", 5);
        expect(item.Item).to.equal(5);
    });
    it("should return 'oko'", () => {
        const item = new containerItem("string", "oko");
        expect(item.Item).to.equal("oko");
    });
    it("should return '{}'", () => {
        const item = new containerItem("object", {});
        expect(item.Item).to.deep.equal({});
    });

    it("should return the same object twice", () => {
        const item = new containerItem("DTTest", DTTest);
        item.AsSingletone();
        const item1 = item.Item;
        const item2 = item.Item;
        expect(item1.value).to.equal(item2.value);
    });
    it("should always return new instance of given type", (done) => {
        const item = new containerItem("DTTest", DTTest);
        item.AsTransient();
        const item1 = item.Item;

        setTimeout(() => {
            const item2 = item.Item;
            expect(item1.value).to.not.equal(item2.value);
            done();
        }, 100);
    });
    it("should always return new instance of given type 2", () => {
        const item = new containerItem("DTTest", DTTest);
        item.AsTransient();
        const item1 = item.Item;
        const item2 = item.Item;
        expect(item1).to.not.equal(item2);
    });
  });

class Test {
    public value: string;
    constructor() {
        this.value = "zupa";
    }
}
// tslint:disable-next-line:max-classes-per-file
class DTTest {
    public value: string;
    constructor() {
        this.value = (new Date()).getTime().toString();
    }
}
