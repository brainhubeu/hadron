import { assert } from 'chai';
import container from '../../../hadron-core/src/container/container';
import { register } from '../logger';

describe('logger', () => {
  it('should register logger', () => {
    register(container, {
      logger: {
        name: 'first logger',
      },
    });
    assert(container.take('firstLogger'));
  });
  it('should register "hello world" under helloWorldLogger', () => {
    register(container, {
      logger: {
        name: 'hello world',
      },
    });
    assert(container.take('helloWorldLogger'));
  });
  it('should register "hello world logger" under helloWorldLogger', () => {
    register(container, {
      logger: {
        name: 'hello world logger',
      },
    });
    assert(container.take('helloWorldLogger'));
  });
  it('should register multiple loggers', () => {
    register(container, {
      logger: [
        {
          name: 'firstLogger',
        },
        {
          name: 'secondLogger',
        },
      ],
    });

    assert(container.take('firstLogger'));
    assert(container.take('secondLogger'));
  })
  it('should not register without name', () => {
    register(container, {
      logger: {},
    });
    assert(!container.take('logger'));
  })
})