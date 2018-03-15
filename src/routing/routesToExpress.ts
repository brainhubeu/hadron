import * as express from 'express';
import container from '../containers/container';
import { getArgs } from '../helpers/functionHelper';
import { IRoute, IRoutesConfig } from '../types/routing';
import { validateMethods } from '../validators/routing';

const convertToExpress = (app: Express.Application, routes: IRoutesConfig) =>
    Object.values(routes).map((route: IRoute) => {
      validateMethods(route.methods);
        // tslint:disable-next-line:ban-types
      const middlewares: Function[] = generateMiddlewares(route) || [];
      createRoutes(app, route, middlewares);
    });

const generateMiddlewares = (route: IRoute) =>
    // tslint:disable-next-line:ban-types
    route.middleware && route.middleware.map((middleware: Function) => {
      return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(middleware(req.params))
                .then(() => next());
      };
    });

// tslint:disable-next-line:ban-types
const createRoutes = (app: any, route: IRoute, middleware: Function[]) =>
    route.methods.map((method: string) => {
      app[method.toLowerCase()](route.path, ...middleware, (req: express.Request, res: express.Response) => {
        Promise.resolve()
            .then(() => {
              const args = getArgs(route.callback)
                                .map((name: string) => {
                                  if (name === 'body') {
                                    return req.body;
                                  }
                                  return req.params[name]
                                        || req.query[name]
                                        || res.locals[name]
                                        || container.take(name);
                                });
              return route.callback(...args);
            })
                .then((result) => res.json(result))
                .catch((error) => res.send(500));
      });
    });

export default convertToExpress;
