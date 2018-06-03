import { expect } from 'chai';
import { isRawMiddleware, createRawMiddleware } from '../generateMiddlewares';
import { getArgs } from '@brainhubeu/hadron-utils';
import * as sinon from 'sinon';
import * as express from 'express';

describe('isRawMiddleware', () => {
  it('returns true when passed middleware is Express middleware', () => {
    const middleware = (req, res, next) => {
      next();
    };

    const actual = isRawMiddleware(middleware);

    expect(actual).to.equal(true);
  });

  it('returns false when passed middleware is Hadron middleware', () => {
    const middleware = (req, deps) => {
      return;
    };

    const actual = isRawMiddleware(middleware);

    expect(actual).to.equal(false);
  });
});

describe('createRawMiddleware', () => {
  it('creates Express middleware from Hadron Middleware', () => {
    const hadronMiddleware = (req, deps) => {
      return null;
    };
    const containerProxy = {};

    const expressMiddleware = createRawMiddleware(
      hadronMiddleware,
      containerProxy,
    );

    expect(getArgs(expressMiddleware as any)).to.eql(['req', 'res', 'next']);
  });

  it('creates middleware that sends response', async () => {
    const hadronMiddleware = (req, deps) => {
      return {
        status: 201,
        body: 'hello',
      };
    };
    const containerProxy = {};

    const expressMiddleware = createRawMiddleware(
      hadronMiddleware as any,
      containerProxy,
    );

    const req = {};
    const res = {
      status: sinon.spy(),
      json: sinon.spy(),
    };
    const next = sinon.spy();

    await expressMiddleware(req as express.Request, res as any, next);

    expect(res.status.firstCall.args).to.eql([201]);
    expect(res.json.firstCall.args).to.eql(['hello']);
  });

  it('creates middleware that sets response headers and status without sending response', async () => {
    const hadronMiddleware = (req, deps) => {
      return {
        type: 'PARTIAL_RESPONSE',
        status: 300,
        headers: {
          'custom-header': 'foo',
        },
      };
    };
    const containerProxy = {};

    const expressMiddleware = createRawMiddleware(
      hadronMiddleware as any,
      containerProxy,
    );

    const req = {};
    const res = {
      status: sinon.spy(),
      json: sinon.spy(),
      set: sinon.spy(),
    };
    const next = sinon.spy();

    await expressMiddleware(req as express.Request, res as any, next);

    expect(res.status.firstCall.args).to.eql([300]);
    expect(res.set.firstCall.args).to.eql(['custom-header', 'foo']);
    expect(res.json.called).to.equal(false);
  });

  it('creates middleware that modifies request', async () => {
    const hadronMiddleware = (req, deps) => {
      return {
        type: 'PARTIAL_REQUEST',
        values: {
          body: 'bar',
          customKey: 'foo',
        },
      };
    };
    const containerProxy = {};

    const expressMiddleware = createRawMiddleware(
      hadronMiddleware as any,
      containerProxy,
    );

    const req = {
      body: null,
      existingKey: 'baz',
    };
    const res = {};
    const next = sinon.spy();

    await expressMiddleware(req as any, res as any, next);

    expect(req).to.eql({
      body: 'bar',
      customKey: 'foo',
      existingKey: 'baz',
    });
  });
});
