import * as express from 'express';
import { getArgs } from '@brainhubeu/hadron-utils';
import {
  Callback,
  IContainer,
  IRoute,
  IRoutesConfig,
  Middleware,
} from './types';
import { validateMethods } from './validators/routing';
import { eventsNames } from './constants/eventsNames';
import GenerateMiddlewareError from './errors/GenerateMiddlewareError';
import CreateRouteError from './errors/CreateRouteError';
import { ServerResponse } from 'http';

const generateMiddlewares = (route: IRoute) =>
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
          console.error(new GenerateMiddlewareError(error));
          res.sendStatus(500);
        });
    },
  );

const mapRouteArgs = (
  req: any,
  res: any,
  routeCallback: Callback,
  container: IContainer,
) =>
  getArgs(routeCallback).map((name: string) => {
    if (name === 'body') {
      return req.body;
    }
    if (name === 'req') {
      return req;
    }
    if (name === 'res') {
      return res;
    }
    return (
      req.params[name] ||
      req.query[name] ||
      res.locals[name] ||
      container.take(name)
    );
  });

const createRoutes = (
  app: any,
  route: IRoute,
  middleware: Middleware[],
  container: IContainer,
  routeName: string,
) =>
  route.methods.map((method: string) => {
    app[method.toLowerCase()](
      route.path,
      ...middleware,
      (req: any, res: express.Response) => {
        Promise.resolve()
          .then(() => {
            const args = mapRouteArgs(req, res, route.callback, container);
            const eventsManager = container.take('events-manager');
            if (!eventsManager) {
              return route.callback(...args);
            }
            const newRouteCallback = eventsManager.emitEvent(
              eventsNames.HANDLE_REQUEST_CALLBACK_EVENT,
              route.callback,
            );
            return newRouteCallback(...args);
          })
          .then((result) => {
            if (!(result instanceof ServerResponse)) {
              res.status(200).json(result);
            }
          })
          .catch((error) => {
            console.error(new CreateRouteError(routeName, error));
            res.sendStatus(500);
          });
      },
    );
  });

const convertToExpress = (routes: IRoutesConfig, container: any) => {
  const app = container.take('server');
  (Object as any).keys(routes).map((key: string) => {
    const route: IRoute = routes[key];
    validateMethods(key, route.methods);
    const middlewares: Middleware[] = generateMiddlewares(route) || [];
    createRoutes(app, route, middlewares, container, key);
  });
};

export default convertToExpress;
