import { IRoute, IMethod } from './IRoute';
import urlGlob, { convertToPattern } from './helpers/urlGlob';
import { IUser } from '..';
import { isUserGranted } from './hierarchyProvider';
import expressMiddlewareAuthorization from './providers/expressMiddlewareAuthorization';

let routes: IRoute[] = [];

export interface ISecuredRoute {
  path: string;
  methods?: string[];
  roles: string | Array<string | string[]>;
}

export const register = (container: any, config: any) => {
  routes = initRoutes(config.securedRoutes);
  const server = container.take('server');

  server.use(
    config.authorizationMiddleware
      ? config.authorizationMiddleware(container)
      : expressMiddlewareAuthorization(container),
  );
};

export const initRoutes = (securedRoutes: ISecuredRoute[]): IRoute[] => {
  const routes: IRoute[] = [];
  securedRoutes.forEach((route) => {
    const existingRoute = getExistsingRoute(
      convertToPattern(route.path),
      routes,
    );

    if (existingRoute) {
      existingRoute.methods = getMethodsForExistsingRoute(
        existingRoute,
        route.methods,
        route.roles,
      );
    } else {
      routes.push(createNewRoute(route.path, route.methods, route.roles));
    }
  });

  return routes;
};

export const isRouteNotSecure = (path: string) =>
  getRouteFromPath(path, routes) === null;

export const isAllowed = (
  path: string,
  allowedMethod: string,
  user: IUser,
  allRoles: string[],
): boolean => {
  try {
    const route = getRouteFromPath(path, routes);
    let isGranted = false;

    route.methods.forEach((method) => {
      if (
        method.name === '*' ||
        method.name.toLowerCase() === allowedMethod.toLowerCase()
      ) {
        if (method.allowedRoles.includes('*') && user.roles.length > 0) {
          isGranted = true;
        } else {
          isGranted = isUserGranted(user, method.allowedRoles, {
            ALL: allRoles,
          });
        }
      }
    });
    return isGranted;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

export const getRouteFromPath = (path: string, routes: IRoute[]): IRoute => {
  const route = routes.filter((r) => urlGlob(r.path, path));
  if (route.length === 0) return null;
  return route[0];
};

export const createNewRoute = (
  path: string,
  methods: string[] = [],
  roles: string | Array<string | string[]>,
) => {
  const methodsForRoute: IMethod[] = [];

  if (methods.length > 0) {
    methods = [...new Set(methods)];
    methods.forEach((methodName) => {
      methodsForRoute.push({
        name: methodName,
        allowedRoles: getRoleArray(roles),
      });
    });
  } else {
    methodsForRoute.push({
      name: '*',
      allowedRoles: getRoleArray(roles),
    });
  }

  const route: IRoute = {
    path: convertToPattern(path),
    methods: methodsForRoute,
  };

  return route;
};

export const getMethodsForExistsingRoute = (
  existingRoute: IRoute,
  methods: string[],
  roles: string | Array<string | string[]>,
): IMethod[] => {
  const newMethods: IMethod[] = methods.map((method) => ({
    allowedRoles: getRoleArray(roles),
    name: method,
  }));

  const existingMethods = existingRoute.methods.filter(
    (method) => newMethods.map((el) => el.name).indexOf(method.name) >= 0,
  );

  const nonExistingMethods = newMethods.filter(
    (method) =>
      existingRoute.methods.map((el) => el.name).indexOf(method.name) === -1,
  );

  existingMethods.forEach((method) => {
    method.allowedRoles = [
      ...new Set(method.allowedRoles.concat(getRoleArray(roles))),
    ];
  });

  let methodsFromRoute = existingRoute.methods.filter(
    (method) =>
      existingMethods.map((el) => el.name).indexOf(method.name) === -1,
  );

  methodsFromRoute = methodsFromRoute.concat(existingMethods);

  return [...methodsFromRoute, ...nonExistingMethods];
};

export const getRoleArray = (roles: string | Array<string | string[]>) => {
  const arr: any[] = [];
  if (typeof roles === 'string') {
    arr.push(roles);
  } else {
    roles.forEach((role) => arr.push(role));
  }

  return [...new Set(arr)];
};

export const getExistsingRoute = (path: string, routes: IRoute[]): IRoute => {
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
  }

  return null;
};
