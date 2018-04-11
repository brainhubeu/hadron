import urlGlob, { convertToPattern } from '../src/helpers/urlToPattern';

class HadronSecurity {
  private routes: IRoute[] = [];

  public allow(path: string, roles: IRole[]): void {
    let existingRoute: IRoute;
    for (const route of this.routes) {
      if (route.path === path) {
        existingRoute = route;
        break;
      }
    }

    if (existingRoute) {
      roles.forEach((role) => existingRoute.allowedRoles.push(role));
      existingRoute.allowedRoles = [...new Set(existingRoute.allowedRoles)];
    } else {
      const route: IRoute = {
        path: convertToPattern(path),
        allowedRoles: roles,
      };

      this.routes.push(route);
    }
  }
  public isAllowed(path: string, user: IUser): boolean {
    const route = this.routes.filter((r) => urlGlob(r.path, path));
    if (route.length === 0) {
      throw new Error(`Path: ${path} is not supported.`);
    }

    return route[0].allowedRoles.some((v) => {
      return user.roles.indexOf(v) >= 0;
    });
  }
}

export default HadronSecurity;
