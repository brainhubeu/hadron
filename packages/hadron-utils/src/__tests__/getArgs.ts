/* tslint:disable:max-classes-per-file */
import { expect } from 'chai';
import getArgs from '../getArgs';

describe('getArgs return list of arguments', () => {
  it('function declaration - should return [\'bar\', \'bar2\']', () => {
    function foo(bar: any, bar2: any) { return null; }
    const args = getArgs(foo);
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('function expression - should return [\'bar\', \'bar2\']', () => {
    const foo = (bar: any, bar2: any) => {
      const t = '';
    };
    const args = getArgs(foo);
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('class declaration - should return [\'bar\', \'bar2\']', () => {
    class Foo {
      constructor(bar: any, bar2: any) { return null; }
    }
    const args = getArgs(Foo);
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('class expression - should return [\'bar\', \'bar2\']', () => {
    const foo = class {constructor(bar: any, bar2: any) {
      const t = '';
    }};
    const args = getArgs(foo);
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('object method is no constructable - should return [\'bar\', \'bar2\']', () => {
    const foo = {foo(bar: any, bar2: any) { return null; }}.foo;
    const args = getArgs(foo);
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('class method - should return [\'bar\', \'bar2\']', () => {
    class Foo {
      public bar(bar: any, bar2: any) { return null; }
    }
    const bar = new Foo().bar;
    const args = getArgs(bar);
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
  it('static class method - should return [\'bar\', \'bar2\']', () => {
    class Foo {
      public static bar(bar: any, bar2: any) { return null; }
    }
    const bar = Foo.bar;
    const args = getArgs(bar);
    expect(['bar', 'bar2']).to.deep.equal(args);
  });
});
