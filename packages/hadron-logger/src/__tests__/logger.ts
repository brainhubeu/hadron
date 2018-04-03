import { assert } from 'chai';
import { register } from '../logger';

let items: any = {};

describe('logger', () => {
  const containerMock = {
    register: (key: string, value: any) => {
      items[key] = value
    },
    take: (key: string) => items[key],
  }

  beforeEach(() => {
    items = {};
  });

  it('should register logger', () => {
    register(containerMock, {
      logger: {
        name: 'first logger',
      },
    });
    assert(containerMock.take('firstLogger'));
  });
  it('should register "hello world" under helloWorldLogger', () => {
    register(containerMock, {
      logger: {
        name: 'hello world',
      },
    });
    assert(containerMock.take('helloWorldLogger'));
  });
  it('should register "hello world logger" under helloWorldLogger', () => {
    register(containerMock, {
      logger: {
        name: 'hello world logger',
      },
    });
    assert(containerMock.take('helloWorldLogger'));
  });
  it('should register multiple loggers', () => {
    register(containerMock, {
      logger: [
        {
          name: 'firstLogger',
        },
        {
          name: 'secondLogger',
        },
      ],
    });

    assert(containerMock.take('firstLogger'));
    assert(containerMock.take('secondLogger'));
  })
  it('should not register without name', () => {
    register(containerMock, {
      logger: {},
    });
    assert(!containerMock.take('logger'));
  })
})