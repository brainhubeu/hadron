import { assert } from 'chai';
import * as sinon from 'sinon';
import * as bunyan from 'bunyan';

import { ILogger } from '../../types';
import bunyanAdapter from '../bunyan';

describe('logger-adapter: bunyan', () => {
  let logger: ILogger;

  const spies: any = {
    info: sinon.spy(),
    debug: sinon.spy(),
    warn: sinon.spy(),
    error: sinon.spy(),
  };

  const createLoggerStub = sinon.stub(bunyan, 'createLogger');
  createLoggerStub.returns(spies);

  after(() => {
    createLoggerStub.restore();
  });
  afterEach(() => {
    Object.keys(spies).forEach((spy: string) => {
      spies[spy].reset();
    });
  });

  it('should create logger instance', () => {
    logger = bunyanAdapter({
      name: 'test',
    });

    assert('log' in logger);
  });

  it('should execute info method', () => {
    logger.log('test');
    assert(spies.info.called);
  });

  it('should execute debug method', () => {
    logger.debug('test');
    assert(spies.debug.called);
  });

  it('should execute warn method', () => {
    logger.warn('test');
    assert(spies.warn.called);
  });

  it('should execute error method', () => {
    logger.error('test');
    assert(spies.error.called);
  });
});
