import * as express from 'express';
import { IContainer, IRoute, Middleware, IHadronExpressConfig } from './types';
import { validateMethods } from './validators/routing';
import { Event } from './constants/eventNames';
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
  containerProxy: any,
  routeName: string,
) => {
  return route.methods.map((method: string) => {
    (app as any)[method.toLowerCase()](
      route.path,
      ...middleware,
      (req: express.Request, res: express.Response) => {
        const request = prepareRequest(req);

        const eventManager = containerProxy.eventManager;

        Promise.resolve()
          .then(() => {
            if (!eventManager) {
              return route.callback(request, containerProxy);
            }

            const newRouteCallback = eventManager.emitEvent(
              Event.HANDLE_REQUEST_CALLBACK_EVENT,
              route.callback,
            );

            return newRouteCallback(request, containerProxy);
          })
          .then((callback) => {
            if (!eventManager) {
              return handleResponseSpec(res)(callback);
            }

            const newResponseHandler = eventManager.emitEvent(
              Event.HANDLE_RESPONSE_EVENT,
              handleResponseSpec,
            );

            return newResponseHandler(res)(callback);
          })
          .catch((error) => {
            const logger = containerProxy.hadronLogger;
            const createRouteError = new CreateRouteError(routeName, error);
            if (logger) {
              logger.error(createRouteError);
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
  const promises: Array<Promise<object>> = [];
  const containerProxy = createContainerProxy(container);
  if (config.routes) {
    promises.push(Promise.resolve(config.routes));
  }

  if (config.routePaths) {
    const paths: string[] = [];
    const extensions: string[] = [];
    (config.routePaths as any).forEach((path: string[]) => {
      paths.push(path[0]);
      if (path.length > 1) {
        extensions.push(path[1]);
      }
    });

    promises.push(jsonProvider(paths, extensions));
  }

  return Promise.all(promises)
    .then((results) =>
      results.reduce(
        (aggregation, current) => ({ ...aggregation, ...current }),
        {},
      ),
    )
    .then((routes: any) => {
      (Object as any).keys(routes).map((key: string) => {
        const route: IRoute = routes[key];
        validateMethods(key, route.methods);
        const middlewares: Middleware[] =
          generateMiddlewares(route, containerProxy) || [];
        createRoutes(app, route, middlewares, containerProxy, key);
      });
    });
};

export default convertToExpress;
