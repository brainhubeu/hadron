import urlGlob, { convertToPattern } from '../src/helpers/urlGlob';
import * as express from 'express';

class HadronSecurity {
  private routes: IRoute[] = [];

  constructor(private userProvider: IUserProvider) {}

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

  public checkIfRouteExists(path: string): IRoute {
    const route = this.routes.filter((r) => urlGlob(r.path, path));
    if (route.length === 0) {
      throw new Error(`Path: ${path} is not supported.`);
    }
    return route[0];
  }

  public isAllowed(path: string, user: IUser): boolean {
    const route = this.checkIfRouteExists(path);

    return route.allowedRoles.some((v) => {
      return user.roles.indexOf(v) >= 0;
    });
  }

  public middleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): any {
    try {
      this.checkIfRouteExists(req.path);
      if (
        this.isAllowed(
          req.path,
          this.userProvider.loadUserByUsername(req.body.username),
        )
      ) {
        console.log('Authenticated');
        next();
      } else {
        console.log('Unauthenitacted');
        res.status(401).json({
          message: 'Unauthenticated',
        });
      }
    } catch (error) {
      console.log('Error');
      next();
    }
  }
}

export default HadronSecurity;
