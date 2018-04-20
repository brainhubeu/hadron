import * as express from 'express';
import { IContainer, IRoute, IRoutesConfig, Middleware } from './types';
import { validateMethods } from './validators/routing';
import { eventNames } from './constants/eventNames';
import CreateRouteError from './errors/CreateRouteError';
import createContainerProxy from './createContainerProxy';
import prepareRequest from './prepareRequest';
import generateMiddlewares from './generateMiddlewares';
import handleResponseSpec from './handleResponseSpec';

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

const convertToExpress = (routes: IRoutesConfig, container: IContainer) => {
  const app = container.take('server');
  (Object as any).keys(routes).map((key: string) => {
    const route: IRoute = routes[key];
    validateMethods(key, route.methods);
    const middlewares: Middleware[] = generateMiddlewares(route) || [];
    createRoutes(app, route, middlewares, container, key);
  });
};

export default convertToExpress;
