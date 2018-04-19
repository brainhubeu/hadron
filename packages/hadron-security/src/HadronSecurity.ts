import urlGlob, { convertToPattern } from '../src/helpers/urlGlob';
import { isUserGranted } from '../src/hierarchyProvider';
import { IRolesMap, IUser } from './hierarchyProvider';
import flattenDeep from './helpers/flattenDeep';
import IUserProvider from './IUserProvider';
import IRoleProvider from './IRoleProvider';
import { IRoute, IMethod } from './IRoute';

class HadronSecurity {
  private routes: IRoute[] = [];

  constructor(
    private userProvider: IUserProvider,
    private roleProvider: IRoleProvider,
    private roleHierarchy: IRolesMap,
  ) {}

  public allow(
    path: string,
    roles: string | Array<string | string[]>,
    methods: string[] = [],
  ): HadronSecurity {
    const nonExistingRoles = this.getNonExistingRoles(roles);
    if (nonExistingRoles.length > 0) {
      console.warn(
        '\x1b[33m\x1b[1m',
        `Roles: [${nonExistingRoles.join(
          ', ',
        )}] does not exists. Your route: "${path}" is secure, but you need to provide new role or change it.`,
        '\x1b[0m',
      );
    }

    let existingRoute: IRoute;

    for (const route of this.routes) {
      if (route.path === convertToPattern(path)) {
        existingRoute = route;
        break;
      }
    }

    if (existingRoute) {
      const existingMethods = existingRoute.methods.filter(
        (method) => methods.indexOf(method.name) >= 0,
      );
      const nonExistingMethods = existingRoute.methods.filter(
        (method) => methods.indexOf(method.name) < 0,
      );

      existingMethods.forEach((method) => {
        method.allowedRoles = [
          ...new Set(method.allowedRoles.concat(this.getRoleArray(roles))),
        ];
      });

      existingRoute.methods = [...existingMethods, ...nonExistingMethods];
    } else {
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

      this.routes.push(route);
    }

    return this;
  }

  public getNonExistingRoles(roles: any): string[] {
    let newRoles = roles;
    if (typeof newRoles === 'string') {
      newRoles = [newRoles];
    }

    newRoles = flattenDeep(newRoles);

    const nonExistingRoles: string[] = [];
    for (const role of newRoles) {
      const existingRole = this.roleProvider
        .getRoles()
        .some((el) => el === role);
      if (!existingRole) {
        nonExistingRoles.push(role);
      }
    }

    return nonExistingRoles;
  }

  public getRouteFromPath(path: string): IRoute {
    const route = this.routes.filter((r) => urlGlob(r.path, path));
    if (route.length === 0) {
      return null;
    }
    return route[0];
  }

  public isAllowed(path: string, allowedMethod: string, user: IUser): boolean {
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
  }

  public getUserProvider(): IUserProvider {
    return this.userProvider;
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
}

export default HadronSecurity;
