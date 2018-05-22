import * as express from 'express';
import { Container } from '@brainhubeu/hadron-core';
import {
  IRoute,
  Middleware,
  HadronMiddleware,
  IContainer,
  MiddlewareResult,
  IPartialRequest,
  IPartialResponse,
} from './types';
import GenerateMiddlewareError from './errors/GenerateMiddlewareError';
import prepareRequest from './prepareRequest';
import handleResponseSpec from './handleResponseSpec';
import { getArgs } from '@brainhubeu/hadron-utils';

const test: MiddlewareResult = {
  partialRes: {
    status: 200,
    headers: {},
  },
};

const isRawMiddleware = (middleware: any) => {
  const [firstArg, secondArg, thirdArg] = getArgs(middleware);
  console.dir({ firstArg, secondArg, thirdArg }, { colors: true, depth: null });

  return (
    (firstArg === 'req' || firstArg === 'request') &&
    (secondArg === 'res' || secondArg === 'response') &&
    thirdArg === 'next'
  );
};

const getResultType = (result: MiddlewareResult) => {
  if (result && result.hasOwnProperty('partialReq')) {
    return 'PARTIAL_REQUEST';
  }

  if (result && result.hasOwnProperty('partialRes')) {
    return 'PARTIAL_RESPONSE_SPEC';
  }

  return 'RESPONSE_SPEC';
};

const createRawMiddleware = (
  hadronMiddleware: HadronMiddleware,
  containerProxy: IContainer,
) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const hadronReq = prepareRequest(req);
    const result = await hadronMiddleware(hadronReq, containerProxy);

    const resultType = getResultType(result);

    switch (resultType) {
      case 'PARTIAL_REQUEST': {
        Object.assign(req, result.partialReq);
        next();
        break;
      }

      case 'PARTIAL_RESPONSE_SPEC': {
        handleResponseSpec(res, { partial: true })(result.partialRes);
        next();
        break;
      }

      default: {
        handleResponseSpec(res)(result);
      }
    }
  };
};

const generateMiddlewares = (route: IRoute) => {
  return (
    route.middleware &&
    route.middleware.map(
      (middleware: Middleware) => (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        Promise.resolve()
          .then(() => middleware(req, res, next))
          .catch((error) => {
            const logger = Container.take('hadronLogger');
            if (logger) {
              logger.warn(new GenerateMiddlewareError(error));
            }

            res.sendStatus(500);
          });
      },
    )
  );
};

export default generateMiddlewares;

// const rawMid = (expressMiddleware: express.Handler) => {
//   return {
//     type: 'raw',
//     code: expressMiddleware,
//   };
// };

// const middlewares = [
//   { type: 'raw', thirdPartyMiddleware1,
//   rawMid(thirdPartyMiddleware2),
//   hadronMiddleware1,
//   hadronMiddleware2,
// ]
