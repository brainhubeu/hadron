import * as express from 'express';
import { IContainer, IRoute, Middleware, IHadronExpressConfig } from './types';
import { validateMethods } from './validators/routing';
import { eventNames } from './constants/eventNames';
import CreateRouteError from './errors/CreateRouteError';
import createContainerProxy from './createContainerProxy';
import prepareRequest from './prepareRequest';
import generateMiddlewares from './generateMiddlewares';
import handleResponseSpec from './handleResponseSpec';
import jsonProvider from '@brainhubeu/hadron-json-provider';

const createRoutes = (
  app: express.Application,
  route: IRoute,
  middleware: Middleware[],
  container: IContainer,
  routeName: string,
) => {
  const containerProxy = createContainerProxy(container);

  return route.methods.map((method: string) => {
    (app as any)[method.toLowerCase()](
      route.path,
      ...middleware,
      (req: express.Request, res: express.Response) => {
        const request = prepareRequest(req);

        Promise.resolve()
          .then(() => {
            const eventManager = container.take('eventManager');

            if (!eventManager) {
              return route.callback(request, containerProxy);
            }

            const newRouteCallback = eventManager.emitEvent(
              eventNames.HANDLE_REQUEST_CALLBACK_EVENT,
              route.callback,
            );

            return newRouteCallback(request, containerProxy);
          })
          .then(handleResponseSpec(res))
          .catch((error) => {
            const logger = container.take('hadronLogger');
            if (logger) {
              logger.warn(new CreateRouteError(routeName, error));
            }

            res.sendStatus(500);
          });
      },
    );
  });
};

const convertToExpress = (
  config: IHadronExpressConfig,
  container: IContainer,
) => {
  const app = container.take('server');
  config.routes &&
    (Object as any).keys(config.routes).map((key: string) => {
      const route: IRoute = config.routes[key];
      validateMethods(key, route.methods);
      const middlewares: Middleware[] = generateMiddlewares(route) || [];
      createRoutes(app, route, middlewares, container, key);
    });

  const paths: string[] = [];
  const extensions: string[] = [];
  config.routePaths &&
    (config.routePaths as any).forEach((path: string[]) => {
      paths.push(path[0]);
      path.length > 1 && extensions.push(path[1]);
    });

  jsonProvider(paths, extensions).then((routes: any) => {
    (Object as any).keys(routes).map((key: string) => {
      const route: IRoute = routes[key];
      validateMethods(key, route.methods);
      const middlewares: Middleware[] = generateMiddlewares(route) || [];
      createRoutes(app, route, middlewares, container, key);
    });
  });
};

export default convertToExpress;
