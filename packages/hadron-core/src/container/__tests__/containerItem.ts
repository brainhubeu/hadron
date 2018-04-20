/* tslint:disable:max-classes-per-file */
import { expect } from 'chai';
import containerItem from '../containerItem';
import { Lifecycle } from '../lifecycle';

describe('containerItem set lifecycle', () => {
  it('should be default(value)', () => {
    const item = containerItem.containerItemFactory('object', Object);
    expect(item.constructor.name).to.equal('ContainerItem');
  });
  it('should be transient', () => {
    const item = containerItem.containerItemFactory(
      'object1',
      Object,
      'transient',
    );
    expect(item.constructor.name).to.equal('ContainerItemTransient');
  });
  it('should be singleton', () => {
    const item = containerItem.containerItemFactory(
      'object2',
      Object,
      Lifecycle.Singleton,
    );
    expect(item.constructor.name).to.equal('ContainerItemSingleton');
  });
});
describe('containerItem set value', () => {
  it('should return 1', () => {
    const item = containerItem.containerItemFactory('number', 5);
    expect(item.Item).to.equal(5);
  });
  it("should return 'oko'", () => {
    const item = containerItem.containerItemFactory('string', 'oko');
    expect(item.Item).to.equal('oko');
  });
  it("should return '{}'", () => {
    const item = containerItem.containerItemFactory('object', {});
    expect(item.Item).to.deep.equal({});
  });

  it('should return the same object twice', () => {
    class Foo {
      public value: string;
      constructor() {
        this.value = new Date().getTime().toString();
      }
    }
    const item = containerItem.containerItemFactory(
      'Fooooo',
      Foo,
      Lifecycle.Singleton,
    );
    const item1 = item.Item;
    const item2 = item.Item;
    expect(item1).to.equal(item2);
  });
  it('should always return new instance of given type', (done) => {
    class Foo {
      public value: string;
      constructor() {
        this.value = new Date().getTime().toString();
      }
    }
    const item = containerItem.containerItemFactory(
      'Foo',
      Foo,
      Lifecycle.Transient,
    );
    const item1 = item.Item;

    setTimeout(() => {
      const item2 = item.Item;
      expect(item1.value).to.not.equal(item2.value);
      done();
    }, 10);
  });
  it('should always return new instance of given type 2', () => {
    class Foo {
      public value: string;
      constructor() {
        this.value = new Date().getTime().toString();
      }
    }
    const item = containerItem.containerItemFactory(
      'Foo',
      Foo,
      Lifecycle.Transient,
    );
    const item1 = item.Item;
    const item2 = item.Item;
    expect(item1).to.not.equal(item2);
  });
});
