import { expect, assert } from 'chai';
import { register } from '../logger';
import LoggerNameIsRequiredError from '../errors/LoggerNameIsRequiredError';
import { Container } from '@brainhubeu/hadron-core';

describe('logger', () => {
  beforeEach(() => {
    Container.register('first logger', '');
    Container.register('firstLogger', '');
    Container.register('secondLogger', '');
  });

  it('should register logger under "first logger"', () => {
    register(Container, {
      logger: {
        name: 'first logger',
      },
    });
    assert(Container.take('first logger'));
  });
  it('should register multiple loggers', () => {
    register(Container, {
      logger: [
        {
          name: 'firstLogger',
        },
        {
          name: 'secondLogger',
        },
      ],
    });

    assert(Container.take('firstLogger'));
    assert(Container.take('secondLogger'));
  });
  it('should not register logger without name', () => {
    expect(() => {
      register(Container, {
        logger: {},
      });
    }).to.throw(LoggerNameIsRequiredError);
  });
});
