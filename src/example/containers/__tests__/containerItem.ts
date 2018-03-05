import { expect } from "chai";
import containerItem from "../ContainerItem";

describe("containerItem set lifetime", () => {
    it("should be default(value)", () => {
        const item = new containerItem("object", Object);
        expect(item.Lifetime).to.equal(2);
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
describe("containerItem set value", () => {
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
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            public value: string;
            constructor() {
                this.value = (new Date()).getTime().toString();
            }
        }
        const item = new containerItem("Foo", Foo);
        item.AsSingletone();
        const item1 = item.Item;
        const item2 = item.Item;
        expect(item1).to.equal(item2);
    });
    it("should always return new instance of given type", (done) => {
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            public value: string;
            constructor() {
                this.value = (new Date()).getTime().toString();
            }
        }
        const item = new containerItem("Foo", Foo);
        item.AsTransient();
        const item1 = item.Item;

        setTimeout(() => {
            const item2 = item.Item;
            expect(item1.value).to.not.equal(item2.value);
            done();
        }, 100);
    });
    it("should always return new instance of given type 2", () => {
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            public value: string;
            constructor() {
                this.value = (new Date()).getTime().toString();
            }
        }
        const item = new containerItem("Foo", Foo);
        item.AsTransient();
        const item1 = item.Item;
        const item2 = item.Item;
        expect(item1).to.not.equal(item2);
    });
  });
describe("getArgs return list of arguments", () => {
    it("function declaration - should return ['bar', 'bar2']", () => {
        // tslint:disable-next-line:no-empty
        function foo(bar: any, bar2: any) { }
        const item = new containerItem("foo", foo);
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
    it("function expression - should return ['bar', 'bar2']", () => {
        // tslint:disable-next-line:only-arrow-functions
        const item = new containerItem("foo", function(bar: any, bar2: any) {
            const t = "";
        });
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
    it("arrow expression - should return ['bar', 'bar2']", () => {
        const item = new containerItem("foo", (bar: any, bar2: any) => {
            const t = "";
        });
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
    it("class declaration - should return ['bar', 'bar2']", () => {
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            // tslint:disable-next-line:no-empty
            constructor(bar: any, bar2: any) { }
        }
        const item = new containerItem("foo", Foo);
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
    it("class expression - should return ['bar', 'bar2']", () => {
        // tslint:disable-next-line:max-classes-per-file
        const item = new containerItem("foo", class {constructor(bar: any, bar2: any) {
            const t = "";
         }});
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
    it("object method is no constructable - should return ['bar', 'bar2']", () => {
        // tslint:disable-next-line:max-classes-per-file
        // tslint:disable-next-line:no-empty
        const item = new containerItem("foo", {foo(bar: any, bar2: any) {}}.foo);
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
    it("static class method - should return ['bar', 'bar2']", () => {
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            // tslint:disable-next-line:no-empty
            public bar(bar: any, bar2: any) {}
          }
        const item = new containerItem("foo", new Foo().bar);
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
    it("class method - should return ['bar', 'bar2']", () => {
        // tslint:disable-next-line:max-classes-per-file
        class Foo {
            // tslint:disable-next-line:no-empty
            public static bar(bar: any, bar2: any) {}
          }
        const item = new containerItem("foo", Foo.bar);
        const args = item.getArgs();
        expect(["bar", "bar2"]).to.deep.equal(args);
    });
});
