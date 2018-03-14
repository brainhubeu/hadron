import * as express from "express";
import { IRoute, IRoutesConfig } from "../types/routing";
import { validateMethods } from "../validators/routing";

const convertToExpress = (app: Express.Application, routes: IRoutesConfig) =>
    Object.values(routes).map((route: IRoute) => {
        validateMethods(route.methods);
        // tslint:disable-next-line:ban-types
        const middlewares: Function[] = generateMiddlewares(route) || [];
        createRoutes(app, route, middlewares);
    });

const generateMiddlewares = (route: IRoute) =>
    // tslint:disable-next-line:ban-types
    route.middleware && route.middleware.map((middleware: Function) => {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            Promise.resolve(middleware(req, res, next));
        };
    });

// tslint:disable-next-line:ban-types
const createRoutes = (app: any, route: IRoute, middleware: Function[]) =>
    route.methods.map((method: string) => {
        app[method.toLowerCase()](route.path, ...middleware, (req: express.Request, res: express.Response) => {
            Promise.resolve(route.callback(req, res));
        });
    });

export default convertToExpress;
