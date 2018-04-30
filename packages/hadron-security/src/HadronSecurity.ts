import urlGlob, { convertToPattern } from '../src/helpers/urlGlob';
import { isUserGranted } from '../src/hierarchyProvider';
import { IRolesMap, IUser } from './hierarchyProvider';
import flattenDeep from './helpers/flattenDeep';
import IUserProvider from './IUserProvider';
import IRoleProvider from './IRoleProvider';
import { IRoute, IMethod } from './IRoute';

class HadronSecurity {
  private routes: IRoute[] = [];
  private roleHierarchy: IRolesMap;
  private authByJWT = true;
  private authByUsernameAndPassword = false;
  private secureAll = false;

  constructor(
    private userProvider: IUserProvider,
    private roleProvider: IRoleProvider,
  ) {
    this.roleProvider.getRoles().then((roles) => {
      this.roleHierarchy = {
        ALL: roles,
      };
    });
  }

  public allow(
    path: string,
    roles: string | Array<string | string[]>,
    methods: string[] = [],
  ): HadronSecurity {
    this.nonExistingRoutesWarning(path, roles);

    let existingRoute: IRoute;

    for (const route of this.routes) {
      if (route.path === convertToPattern(path)) {
        existingRoute = route;
        break;
      }
    }

    if (existingRoute) {
      existingRoute.methods = this.getMethodsForExistingRoute(
        existingRoute,
        methods,
        roles,
      );
    } else {
      this.routes.push(this.getNewRoute(path, methods, roles));
    }

    return this;
  }

  public secureAllRoutes(): HadronSecurity {
    this.secureAll = true;
    return this;
  }

  public isSecuredAll(): boolean {
    return this.secureAll;
  }

  public getRouteFromPath(path: string): IRoute {
    const route = this.routes.filter((r) => urlGlob(r.path, path));
    if (route.length === 0) {
      return null;
    }
    return route[0];
  }

  public isAllowed(path: string, allowedMethod: string, user: IUser): boolean {
    try {
      const route = this.getRouteFromPath(path);
      let isGranted = false;

      route.methods.forEach((method) => {
        if (
          method.name === '*' ||
          method.name.toLowerCase() === allowedMethod.toLowerCase()
        ) {
          isGranted = isUserGranted(
            user,
            method.allowedRoles,
            this.roleHierarchy,
          );
        }
      });
      return isGranted;
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }

  public authenticateByUsernameAndPassword(): void {
    this.authByUsernameAndPassword = true;
    this.authByJWT = false;
  }

  public authenticateByJwtToken(): void {
    this.authByUsernameAndPassword = false;
    this.authByJWT = true;
  }

  public getUserProvider(): IUserProvider {
    return this.userProvider;
  }

  public isAuthByJWT(): boolean {
    return this.authByJWT;
  }

  public isAuthByUsernameAndPassword(): boolean {
    return this.authByUsernameAndPassword;
  }

  private getRoleArray(
    roles: string | Array<string | string[]>,
  ): Array<string | string[]> {
    const arr: any[] = [];
    if (typeof roles === 'string') {
      arr.push(roles);
    } else {
      roles.forEach((role) => arr.push(role));
    }
    return [...new Set(arr)];
  }

  private getNonExistingRoles(roles: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let newRoles = roles;
      if (typeof newRoles === 'string') {
        newRoles = [newRoles];
      }

      newRoles = flattenDeep(newRoles);

      const nonExistingRoles: string[] = [];
      this.roleProvider.getRoles().then((roles) => {
        for (const role of newRoles) {
          if (!roles.some((el) => el === role)) {
            nonExistingRoles.push(role);
          }
        }
        resolve(nonExistingRoles);
      });
    });
  }

  private nonExistingRoutesWarning(
    path: string,
    roles: string | Array<string | string[]>,
  ): void {
    this.getNonExistingRoles(roles).then((nonExistingRoles) => {
      if (nonExistingRoles.length > 0) {
        console.warn(
          '\x1b[33m\x1b[1m',
          `Roles: [${nonExistingRoles.join(
            ', ',
          )}] does not exists. Your route: "${path}" is secure, but you need to provide new role or change it.`,
          '\x1b[0m',
        );
      }
    });
  }

  private getMethodsForExistingRoute(
    existingRoute: IRoute,
    methods: string[],
    roles: string | Array<string | string[]>,
  ): IMethod[] {
    const newMethods: IMethod[] = methods.map((method) => ({
      allowedRoles: this.getRoleArray(roles),
      name: method,
    }));

    const existingMethods = existingRoute.methods.filter(
      (method) => newMethods.map((el) => el.name).indexOf(method.name) >= 0,
    );

    const nonExistingMethods = newMethods.filter((method) => {
      return (
        existingRoute.methods.map((el) => el.name).indexOf(method.name) === -1
      );
    });

    existingMethods.forEach((method) => {
      method.allowedRoles = [
        ...new Set(method.allowedRoles.concat(this.getRoleArray(roles))),
      ];
    });

    let methodsFromRoute = existingRoute.methods.filter((method) => {
      return existingMethods.map((el) => el.name).indexOf(method.name) === -1;
    });

    methodsFromRoute = methodsFromRoute.concat(existingMethods);

    return [...methodsFromRoute, ...nonExistingMethods];
  }

  private getNewRoute(
    path: string,
    methods: string[],
    roles: string | Array<string | string[]>,
  ) {
    const methodsForRoute: IMethod[] = [];
    if (methods.length > 0) {
      methods = [...new Set(methods)];
      methods.forEach((methodName) => {
        methodsForRoute.push({
          name: methodName,
          allowedRoles: this.getRoleArray(roles),
        });
      });
    } else {
      methodsForRoute.push({
        name: '*',
        allowedRoles: this.getRoleArray(roles),
      });
    }

    const route: IRoute = {
      path: convertToPattern(path),
      methods: methodsForRoute,
    };

    return route;
  }
}

export default HadronSecurity;
