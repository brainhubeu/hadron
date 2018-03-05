import { expect } from "chai";
import Container from "../Container";

describe("container register", () => {
    it("should register 2 items", () => {
        const container = new Container();
        container.register("test", "given");
        container.register("test2", "given");
        expect(2).to.equal(container.CountItems());
    });
    it("should reregister item for the same key", () => {
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
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            public value: string;
            constructor() {
                this.value = (new Date()).getTime().toString();
            }
        }
        container.register(itemName, Foo).AsSingletone();
        const item1 = container.take(itemName);
        const item2 = container.take(itemName);
        expect(item2).to.deep.equal(item1);
    });
    it("should always return a new same object - Transient", () => {
        const container = new Container();
        const itemName = "test";
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            public value: string;
            constructor() {
                this.value = (new Date()).getTime().toString();
            }
        }
        container.register(itemName, Foo).AsTransient();
        const item1 = container.take(itemName);
        const item2 = container.take(itemName);
        expect(item2).to.not.equal(item1);
    });
  });
describe("container items with parameters in constructor", () => {
    it("second level of injection", () => {
        const container = new Container();

        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            public value: number;
            constructor() {
                this.value = 4;
            }
        }
        // tslint:disable-next-line:max-classes-per-file
        class Foo2 {
            public value: number;
            constructor(parameterName: Foo) {
                this.value = parameterName.value;
            }
        }
        container.register("parameterName", Foo).AsTransient();
        container.register("foo2", Foo2).AsTransient();

        const item = container.take("foo2") as Foo2;

        expect(4).to.be.equal(item.value);
        });
    });
