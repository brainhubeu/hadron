import * as express from 'express';
<<<<<<< HEAD:packages/hadron-express/src/hadronToExpress.ts
import { getArgs } from './helpers/functionHelper';
import { Callback, IContainer, IRoute, IRoutesConfig, Middleware } from './types';
import { validateMethods } from './validators/routing';
=======
import container from '../containers/container';
import { getArgs } from '../helpers/functionHelper';
import { IRoute, IRoutesConfig } from '../types/routing';
import { validateMethods } from '../validators/routing';
<<<<<<< HEAD:packages/hadron-express/src/hadronToExpress.ts
=======
import * as express from "express";
import container from "../containers/container";
import { getArgs } from "../helpers/functionHelper";
import { IRoute, IRoutesConfig } from "../types/routing";
import { validateMethods } from "../validators/routing";
import registerEvents from '../events/registerEvents';
import Container from "../containers/container";
import listenersWrapper from '../events/listeners';
import listeners from '../events/listeners';


const convertToExpress = (app: Express.Application, routes: IRoutesConfig) =>
    Object.values(routes).map((route: IRoute) => {
        validateMethods(route.methods);
        // tslint:disable-next-line:ban-types
        const middlewares: Function[] = generateMiddlewares(route) || [];
        createRoutes(app, route, middlewares);
    });
>>>>>>> add EventEmitter, pull out listeners from other file and make them subscribe to this event
>>>>>>> add EventEmitter, pull out listeners from other file and make them subscribe to this event:src/routing/hadronToExpress.ts

=======
>>>>>>> fix tslint:src/routing/hadronToExpress.ts
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

<<<<<<< HEAD:packages/hadron-express/src/hadronToExpress.ts
const createRoutes = (app: any, route: IRoute, middleware: Middleware[], container: IContainer) =>
=======
// tslint:disable-next-line:ban-types
const createRoutes = (app: any, route: IRoute, middleware: Function[]) =>
<<<<<<< HEAD:packages/hadron-express/src/hadronToExpress.ts
<<<<<<< HEAD
>>>>>>> add EventEmitter, pull out listeners from other file and make them subscribe to this event:src/routing/hadronToExpress.ts
=======
>>>>>>> fix tslint:src/routing/hadronToExpress.ts
  route.methods.map((method: string) => {
    app[method.toLowerCase()](route.path, ...middleware, (req: any, res: express.Response) => {
      Promise.resolve()
          .then(() => {
            const args = mapRouteArgs(req, res, route.callback, container);
            return route.callback(...args);
          })
          .then(result => res.json(result))
          .catch(error => res.send(500));
    });
  });

<<<<<<< HEAD:packages/hadron-express/src/hadronToExpress.ts
const convertToExpress = (routes: IRoutesConfig, container: any) => {
  const app = container.take('server');
  Object.values(routes).map((route: IRoute) => {
    validateMethods(route.methods);
    const middlewares: Middleware[] = generateMiddlewares(route) || [];
    createRoutes(app, route, middlewares, container);
  });
}
=======
const convertToExpress = (app: Express.Application, routes: IRoutesConfig) =>
    Object.values(routes).map((route: IRoute) => {
      validateMethods(route.methods);
        // tslint:disable-next-line:ban-types
      const middlewares: Function[] = generateMiddlewares(route) || [];
      createRoutes(app, route, middlewares);
    });
>>>>>>> add EventEmitter, pull out listeners from other file and make them subscribe to this event:src/routing/hadronToExpress.ts

export default convertToExpress;
