import ExampleRouting from "./ExampleRouting";
import { Core } from "./types/core";
import {Router} from "express";
import {RequestHandler} from "express-serve-static-core";
import {__values} from "tslib";

interface IRoute {
    callback?: RequestHandler,
    middleware?: RequestHandler[],
    path: string,
    method: string,
}

function ConvertToExpress(app: any) {
    Object.values(ExampleRouting).map((route) => {
        const middlewares: Function[] = [];

        route.middleware.map((middleware) => {
            const middlewareFunc = (req: any, res: any, next: any) => {
                middleware();
                next();
            };

            middlewares.push(middlewareFunc);
        });

        route.methods.map((method) => {
            app[method.toLowerCase()](route.path, ...middlewares, (req: any, res: any) => {
                // getParameters();

                route.callback();
                res.send("Test", 200);
            });
        });
    });
}

function getParameters(req: any) {
    console.log(req.params);
}

export default ConvertToExpress;