/* tslint:disable:max-classes-per-file */
import { expect } from 'chai';
import containerItem from '../containerItem';
import { Lifetime } from '../lifetime';

describe('containerItem set lifetime', () => {
  it('should be default(value)', () => {
    const item = containerItem.containerItemFactory('object', Object);
    expect(item.constructor.name).to.equal('ContainerItem');
  });
  it('should be transient', () => {
    const item = containerItem.containerItemFactory('object1', Object, 'transient');
    expect(item.constructor.name).to.equal('ContainerItemTransient');
  });
  it('should be singletone', () => {
    const item = containerItem.containerItemFactory('object2', Object, Lifetime.Singletone);
    expect(item.constructor.name).to.equal('ContainerItemSingletone');
  });
});
describe('containerItem set value', () => {
  it('should return 1', () => {
    const item = containerItem.containerItemFactory('number', 5);
    expect(item.Item).to.equal(5);
  });
  it('should return \'oko\'', () => {
    const item = containerItem.containerItemFactory('string', 'oko');
    expect(item.Item).to.equal('oko');
  });
  it('should return \'{}\'', () => {
    const item = containerItem.containerItemFactory('object', {});
    expect(item.Item).to.deep.equal({});
  });

  it('should return the same object twice', () => {
    class Foo {
      public value: string;
      constructor() {
        this.value = (new Date()).getTime().toString();
      }
    }
    const item = containerItem.containerItemFactory('Fooooo', Foo, Lifetime.Singletone);
    const item1 = item.Item;
    const item2 = item.Item;
    expect(item1).to.equal(item2);
  });
  it('should always return new instance of given type', done => {
    class Foo {
      public value: string;
      constructor() {
        this.value = (new Date()).getTime().toString();
      }
    }
    const item = containerItem.containerItemFactory('Foo', Foo, Lifetime.Transient);
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
        this.value = (new Date()).getTime().toString();
      }
    }
    const item = containerItem.containerItemFactory('Foo', Foo, Lifetime.Transient);
    const item1 = item.Item;
    const item2 = item.Item;
    expect(item1).to.not.equal(item2);
  });
});
describe('getArgs return list of arguments', () => {
  it('function declaration - should return [\'bar\', \'bar2\']', () => {
    function foo(bar: any, bar2: any) { return null; }
    const item = containerItem.containerItemFactory('foo', foo);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('function expression - should return [\'bar\', \'bar2\']', () => {
    const item = containerItem.containerItemFactory('foo', (bar: any, bar2: any) => {
      const t = '';
    }, Lifetime.Value);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('arrow expression - should return [\'bar\', \'bar2\']', () => {
    const item = containerItem.containerItemFactory('foo', (bar: any, bar2: any) => {
      const t = '';
    }, Lifetime.Value);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('class declaration - should return [\'bar\', \'bar2\']', () => {
    class Foo {
      constructor(bar: any, bar2: any) { return null; }
    }
    const item = containerItem.containerItemFactory('foo', Foo);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('class expression - should return [\'bar\', \'bar2\']', () => {
    const item = containerItem.containerItemFactory('foo', class {constructor(bar: any, bar2: any) {
      const t = '';
    }}, Lifetime.Value);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('object method is no constructable - should return [\'bar\', \'bar2\']', () => {
    const item = containerItem.containerItemFactory('foo', {foo(bar: any, bar2: any) { return null; }}.foo
      , Lifetime.Value);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('static class method - should return [\'bar\', \'bar2\']', () => {
    class Foo {
      public bar(bar: any, bar2: any) { return null; }
    }
    const item = containerItem.containerItemFactory('foo', new Foo().bar);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('class method - should return [\'bar\', \'bar2\']', () => {
    class Foo {
      public static bar(bar: any, bar2: any) { return null; }
    }
    const item = containerItem.containerItemFactory('foo', Foo.bar);
    const args = item.getArgs();
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
});
