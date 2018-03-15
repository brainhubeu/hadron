import * as express from "express";
import { IRoute, IRoutesConfig } from "../types/routing";
import { validateMethods } from "../validators/routing";
import { EventEmitter } from "events";
import listenersWrapper from '../../app/listeners';
import Container from '../containers/container';


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
            Promise.resolve(middleware(req.params))
                .then(() => next());
        };
    });

// tslint:disable-next-line:ban-types
const createRoutes = (app: any, route: IRoute, middleware: Function[]) =>
    route.methods.map((method: string) => {
        app[method.toLowerCase()](route.path, (req: express.Request, res: express.Response) => {
            Promise.resolve()
                .then(() => {
                    const eventName = 'someEvent';
                    const event = {
                        callback: route.callback,
                    }
                    const emitter = Container.take('emitter');

                    const listeners = Object.values(listenersWrapper);
                    listeners.forEach(listener => {
                        if(listener.event === eventName){
                            emitter.on(eventName, listener.handler(req.params));
                        }
                    })
                    emitter.emit(eventName, event);
                    return event.callback(req.params);
                })
                .then((result) => res.json(result));
        });
    });

export default convertToExpress;
