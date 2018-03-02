import { expect } from "chai";
import Container from "../Container";

describe.only("container register", () => {
    it("should be equal to 2", () => {
        const container = new Container();
        container.register("test", "given");
        container.register("test2", "given");
        expect(2).to.equal(container.CountItems());
    });
    it("should overrive the same key", () => {
        const container = new Container();
        const itemName = "test";
        container.register(itemName, "given");
        container.register(itemName, "given2");
        expect(1).to.equal(container.CountItems());
    });
    it("should overrive value for the the same key", () => {
        const container = new Container();
        const itemName = "test";
        container.register(itemName, "given");
        container.register(itemName, "given2");
        expect("given2").to.equal(container.take(itemName));
    });
    it("should always return the same object - Singletone", () => {
        const container = new Container();
        const itemName = "test";
        container.register(itemName, DTTest).AsSingletone();
        const item1 = container.take(itemName);
        const item2 = container.take(itemName);
        expect(item2).to.deep.equal(item1);
    });
    it("should always return a new same object - Transient", () => {
        const container = new Container();
        const itemName = "test";
        container.register(itemName, DTTest).AsTransient();
        const item1 = container.take(itemName);
        const item2 = container.take(itemName);
        expect(item2).to.not.equal(item1);
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
