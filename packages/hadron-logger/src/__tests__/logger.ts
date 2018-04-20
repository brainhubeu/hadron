import { expect, assert } from 'chai';
import { Container } from '@brainhubeu/hadron-core';
import { register, registerAdapter } from '../logger';
import LoggerNameIsRequiredError from '../errors/LoggerNameIsRequiredError';
import LoggerAdapterNotDefinedError from '../errors/LoggerAdapterNotDefinedError';
import CouldNotRegisterLoggerInContainerError from '../errors/CouldNotRegisterLoggerInContainerError';
import ConfigNotDefinedError from '../errors/ConfigNotDefinedError';
import { ILogger } from '../types';

describe('logger', () => {
  beforeEach(() => {
    Container.register('firstlogger', '');
    Container.register('firstLogger', '');
    Container.register('secondLogger', '');
    Container.register('UnknownTypeLogger', '');
  });

  it('should register logger under "firstlogger"', () => {
    register(Container, {
      logger: {
        name: 'firstlogger',
        type: 'bunyan',
      },
    });
    assert(Container.take('firstlogger'));
  });

  it('should register multiple loggers', () => {
    register(Container, {
      logger: [
        {
          name: 'firstLogger',
          type: 'bunyan',
        },
        {
          name: 'secondLogger',
          type: 'bunyan',
        },
      ],
    });

    assert(Container.take('firstLogger'));
    assert(Container.take('secondLogger'));
  });

  it('when there is no name provided in config then should throw LoggerNameIsRequiredError', () => {
    expect(() => {
      register(Container, {
        logger: {
          type: 'bunyan',
        },
      } as any);
    }).to.throw(LoggerNameIsRequiredError);
  });

  it('when there is no type of logger, should register it with default logger', () => {
    register(Container, {
      logger: {
        name: 'firstLogger',
      },
    } as any);
    assert(Container.take('firstLogger'));
  });

  it('when logger is defined with type that has not any adapter then should throw LoggerAdapterNotDefinedError', () => {
    expect(() => {
      register(Container, {
        logger: {
          type: 'unknown-type',
          name: 'UnknownTypeLogger',
        },
      });
    }).to.throw(LoggerAdapterNotDefinedError);
  });

  it('should register logger with custom adapter', () => {
    registerAdapter('custom', (config: any) => ({}));

    register(Container, {
      logger: {
        name: 'firstLogger',
        type: 'custom',
      },
    });
    assert(Container.take('firstLogger'));
  });

  it('when custom adapter is broken should throw CouldNotRegisterLoggerInContainerError', () => {
    registerAdapter('custom', null);

    expect(() => {
      register(Container, {
        logger: {
          name: 'firstLogger',
          type: 'custom',
        },
      });
    }).to.throw(CouldNotRegisterLoggerInContainerError);
  });

  it('when did not provided logger info then should throw ConfigNotDefinedError', () => {
    expect(() => {
      register(Container, {} as any);
    }).to.throw(ConfigNotDefinedError);
  });
});
