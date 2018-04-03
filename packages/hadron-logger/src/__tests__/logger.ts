import { assert } from 'chai';
import * as sinon from 'sinon';
import { register } from '../logger';

describe('logger', () => {
  const containerMock = {
    register: sinon.stub(),
    take: () => null,
  };

  beforeEach(() => {
    containerMock.register.reset();
  });

  it('should register logger under firstLogger', () => {
    register(containerMock, {
      logger: {
        name: 'first logger',
      },
    });
    assert(containerMock.register.calledWith('firstLogger'));
  });
  it('should register "hello world" under helloWorldLogger', () => {
    register(containerMock, {
      logger: {
        name: 'hello world',
      },
    });
    assert(containerMock.register.calledWith('helloWorldLogger'));
  });
  it('should register "hello world logger" under helloWorldLogger', () => {
    register(containerMock, {
      logger: {
        name: 'hello world logger',
      },
    });
    assert(containerMock.register.calledWith('helloWorldLogger'));
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

    assert(containerMock.register.calledWith('firstLogger'));
    assert(containerMock.register.calledWith('secondLogger'));
  });
  it('should not register logger without name', () => {
    register(containerMock, {
      logger: {},
    });
    assert(!containerMock.register.calledWith('logger'));
  });
});
