import * as express from 'express';
import { Container } from '@brainhubeu/hadron-core';
import { IRoute, Middleware } from './types';
import GenerateMiddlewareError from './errors/GenerateMiddlewareError';

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
