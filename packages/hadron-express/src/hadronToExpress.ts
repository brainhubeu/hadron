import * as express from 'express';
import { getArgs } from '@hadron/utils';
import { Callback, IContainer, IRoute, IRoutesConfig, Middleware } from './types';
import { validateMethods } from './validators/routing';
import { EVENTS_MANAGER, EVENT_NAME } from '@hadron/events';
import GenerateMiddlewareError from './errors/GenerateMiddlewareError';
import CreateRouteError from './errors/CreateRouteError';

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
      return req.files || req.file;
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
            try {
<<<<<<< HEAD
              const eventsManager = container.take(constants.EVENTS_MANAGER);
              const newRouteCallback = eventsManager.emitEvent(
                eventsNames.CREATE_ROUTES_EVENT,
                route.callback,
              );
=======
              const eventsManager = container.take(EVENTS_MANAGER);
              const newRouteCallback = eventsManager.emitEvent(CREATE_ROUTES_EVENT, route.callback);
>>>>>>> changed scripts to deploy/clean + changed way packages are imported
              return newRouteCallback(...args);
            } catch (error) {
              return route.callback(...args);
            }
          })
          .then((result) => res.json(result))
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
