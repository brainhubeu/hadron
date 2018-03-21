import * as express from 'express';
import { getArgs } from './helpers/functionHelper';
import { Callback, IContainer, IRoute, IRoutesConfig, Middleware } from './types';
import { validateMethods } from './validators/routing';

const generateMiddlewares = (route: IRoute) =>
  route.middleware && route.middleware.map((middleware: Middleware) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      Promise.resolve()
              .then(() => middleware(req, res, next))
              .catch(error => res.send(500));
    },
  );

const mapRouteArgs = (req: any, res: any, routeCallback: Callback, container: IContainer) =>
  getArgs(routeCallback)
    .map((name: string) => {
      if (name === 'body') {
        return req.body;
      }
      if (name === 'req') {
        return req.files || req.file;
      }
      return req.params[name]
            || req.query[name]
            || res.locals[name]
            || container.take(name);
    });

const createRoutes = (app: any, route: IRoute, middleware: Middleware[], container: IContainer) =>
  route.methods.map((method: string) => {
    app[method.toLowerCase()](route.path, ...middleware, (req: any, res: express.Response) => {
      Promise.resolve()
          .then(() => {
            const args = mapRouteArgs(req, res, route.callback, container);
            return route.callback(...args);
          })
          .then(result => res.json(result))
          .catch(error => {
            console.log(error);
            res.send(500)
          });
    });
  });

const convertToExpress = (routes: IRoutesConfig, container: any) => {
  const app = container.take('server');
  Object.values(routes).map((route: IRoute) => {
    validateMethods(route.methods);
    const middlewares: Middleware[] = generateMiddlewares(route) || [];
    createRoutes(app, route, middlewares, container);
  });
}

export default convertToExpress;
