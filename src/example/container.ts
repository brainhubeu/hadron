import { Container as container, Lifetime } from '../../packages/hadron-core';
// register value
container.register('value', 18);
const value = container.take('value');
// tslint:disable-next-line:no-console
console.log(value);

// register singletone class
class TestClass {
  public value: string;
  constructor() {
    this.value = this.constructor.name;
  }
  public getName() {
    return value;
  }
}
container.register('xxxTestClass', TestClass, Lifetime.Singletone);
const testClassInstance = container.take('xxxTestClass');
// tslint:disable-next-line:no-console
console.log(testClassInstance.value);

// register class with parameters in constructor
// tslint:disable-next-line:max-classes-per-file
class TestClass2 {
  public value: string;
  constructor(param: TestClass) {
    this.value = param.value;
  }
}

container.register('param', TestClass, Lifetime.Transient);
container.register('TestClass2', TestClass2, Lifetime.Transient);
const testClass2Instance = container.take('TestClass2');
// tslint:disable-next-line:no-console
console.log(`${testClass2Instance.value}2`);
