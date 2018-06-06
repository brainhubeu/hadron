/* tslint:disable:max-classes-per-file */
import { expect } from 'chai';
import container from '../container';
import { Lifecycle } from '../lifecycle';

describe('container register', () => {
  it('should overrive value for the the same key', () => {
    const itemName = 'test';
    container.register(itemName, 'given');
    container.register(itemName, 'given2');
    expect('given2').to.equal(container.take(itemName));
  });
  it('should always return the same object - Singleton', () => {
    const itemName = 'test';
    class Foo {
      public value: string;
      constructor() {
        this.value = new Date().getTime().toString();
      }
    }
    container.register(itemName, Foo, Lifecycle.Singleton);
    const item1 = container.take(itemName);
    const item2 = container.take(itemName);
    expect(item2).to.deep.equal(item1);
  });
  it('should always return a new same object - Transient', () => {
    class Foo {
      public value: string;
      constructor() {
        this.value = 'xxxx';
      }
    }
    container.register('test', Foo, Lifecycle.Transient);
    const item1 = container.take('test');
    const item2 = container.take('test');
    expect(item1).to.deep.equal(item2);
  });
});
describe('container items with parameters in constructor', () => {
  it('second level of injection', () => {
    class Foo {
      public value: number;
      constructor() {
        this.value = 4;
      }
    }
    class Foo2 {
      public value: number;
      constructor(parameterName: Foo) {
        this.value = parameterName.value;
      }
    }
    container.register('parameterName', Foo, Lifecycle.Transient);
    container.register('foo2', Foo2, Lifecycle.Transient);

    const item = container.take('parameterName') as Foo;

    expect(4).to.be.equal(item.value);
  });
});
describe("list of container's items keys ", () => {
  it('should return array of keys of earlier registered items', () => {
    container.register('key1', 'item1');
    container.register('key2', 'item2');
    const keys = container.keys();
    expect(keys).to.include('key1');
    expect(keys).to.include('key2');
  });
});
