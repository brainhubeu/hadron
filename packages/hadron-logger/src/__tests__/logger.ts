import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import { register } from '../logger';
import LoggerNameIsRequiredError from '../errors/LoggerNameIsRequiredError';

describe('logger', () => {
  const containerMock = {
    register: sinon.stub(),
    take: () => null,
  };

  beforeEach(() => {
    containerMock.register.reset();
  });

  it('should register logger under "first logger"', () => {
    register(containerMock, {
      logger: {
        name: 'first logger',
      },
    });
    assert(containerMock.register.calledWith('first logger'));
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
    expect(() => {
      register(containerMock, {
        logger: {},
      });
    }).to.throw(LoggerNameIsRequiredError);
  });
});
