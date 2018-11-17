import * as express from 'express';
import { Container } from '@brainhubeu/hadron-core';
import { IRoute, Middleware, HadronMiddleware } from './types';
import GenerateMiddlewareError from './errors/GenerateMiddlewareError';
import prepareRequest from './prepareRequest';
import handleResponseSpec from './handleResponseSpec';
import { getArgs } from '@brainhubeu/hadron-utils';

export const isRawMiddleware = (middleware: any) => {
  const [firstArg, secondArg, thirdArg] = getArgs(middleware);

  return (
    (firstArg === 'req' || firstArg === 'request') &&
    (secondArg === 'res' || secondArg === 'response') &&
    thirdArg === 'next'
  );
};

export const createRawMiddleware = (
  hadronMiddleware: HadronMiddleware,
  containerProxy: any,
) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const hadronReq = prepareRequest(req);
    const result = await hadronMiddleware(hadronReq, containerProxy);

    switch (result.type) {
      case 'PARTIAL_REQUEST': {
        Object.assign(req, result.values);
        next();
        break;
      }

      case 'PARTIAL_RESPONSE': {
        handleResponseSpec(res)(result);
        next();
        break;
      }

      default: {
        handleResponseSpec(res)(result);
      }
    }
  };
};

const generateMiddlewares = (
  middlewares: Middleware[],
  containerProxy: any,
) => {
  return (middlewares || []).map((middleware: any) => {
    const rawMiddleware: Middleware = isRawMiddleware(middleware)
      ? middleware
      : createRawMiddleware(middleware as HadronMiddleware, containerProxy);

    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      Promise.resolve()
        .then(() => rawMiddleware(req, res, next))
        .catch((error) => {
          const logger = Container.take('hadronLogger');
          if (logger) {
            logger.warn(new GenerateMiddlewareError(error));
          }

          res.sendStatus(500);
        });
    };
  });
};

export default generateMiddlewares;
