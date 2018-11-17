import * as express from 'express';
import * as nodePath from 'path';
import {
  IContainer,
  IRoute,
  Middleware,
  IHadronExpressConfig,
  IRoutesConfig,
} from './types';
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
  containerProxy: any,
  routeName: string,
) => {
  return route.methods.map((method: string) => {
    (app as any)[method.toLowerCase()](
      route.path,
      ...route.middleware,
      (req: express.Request, res: express.Response) => {
        const request = prepareRequest(req);
        const eventManager = containerProxy.take('eventManager');

        Promise.resolve()
          .then(() => {
            if (!eventManager) {
              return route.callback(request, containerProxy, res.locals);
            }

            const newRouteCallback = eventManager.emitEvent(
              Event.HANDLE_REQUEST_CALLBACK_EVENT,
              route.callback,
            );

            return newRouteCallback(request, containerProxy, res.locals);
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

  return (
    Promise.all(promises)
      .then((results) =>
        results.reduce(
          (aggregation, current) => ({ ...aggregation, ...current }),
          {},
        ),
      )
      // flatten routes and prepare all components
      .then((routes: any) =>
        (Object as any)
          .keys(routes)
          .map((key: string) => prepareRoute(routes[key], key, containerProxy))
          .reduce((agg: any, current: any) => ({ ...agg, ...current })),
      )
      .then((preparedRoutes: IRoutesConfig) => {
        (Object as any).keys(preparedRoutes).map((key: string) => {
          const route: IRoute = preparedRoutes[key];
          createRoutes(app, route, container, key);
        });
      })
  );
};

const prepareRoute = (
  route: IRoute,
  key: string,
  container: IContainer,
  parentRoute: IRoute = {},
  parentKey: string = null,
) => {
  const middlewares = prepareMiddlewares(
    generateMiddlewares(route.middleware, container),
    generateMiddlewares(route.$middleware, container),
    parentRoute.middleware,
  );
  const path = preparePath(route.path, route.$path, parentRoute.path);

  const methods = prepareMethods(
    route.methods,
    route.$methods,
    parentRoute.methods,
  );

  const routeKey = parentKey ? `${parentKey}.${key}` : key;

  const preparedRoute = {
    ...route,
    path,
    methods,
    middleware: middlewares,
  };

  const result = {
    [routeKey]: preparedRoute,
  };

  if (route.routes) {
    return {
      ...result,
      ...(Object as any)
        .keys(route.routes)
        .map((childKey: string) =>
          prepareRoute(
            (route.routes as any)[childKey],
            childKey,
            container,
            preparedRoute,
            routeKey,
          ),
        )
        .reduce((agg: any, current: any) => ({ ...agg, ...current })),
    };
  }

  return result;
};

export const prepareMiddlewares = (
  middleware: any[],
  $middleware: any[],
  parentMiddleware: Middleware[],
) => {
  if ($middleware) {
    return $middleware;
  }
  return [...(parentMiddleware || []), ...(middleware || [])];
};

export const preparePath = (
  path: string,
  $path: string,
  parentPath: string = '',
) => {
  if ($path) {
    return $path;
  }
  return nodePath.join(parentPath, path);
};

export const prepareMethods = (
  methods: string[],
  $methods: string[],
  parentMethods: string[] = [],
) => {
  if ($methods) {
    return $methods;
  }
  return [...(methods || []), ...parentMethods].reduce(
    (agg, next) => (agg.indexOf(next) >= 0 ? agg : [...agg, next]),
    [],
  );
};

export default convertToExpress;
