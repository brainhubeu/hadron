import { expect } from "chai";

import * as express from "express";
import * as HTTPStatus from "http-status";
import * as sinon from "sinon";
import * as request from "supertest";

import RouterMethodError from "../errors/RouterMethodError";
import routesToExpress from "../routing/routesToExpress";

let app = express();

// tslint:disable-next-line:ban-types
const createTestRoute = (path: string, methods: string[], callback: Function, middleware?: Function[]) => ({
    testRoute: {
        callback,
        methods,
        middleware,
        path,
    },
});

const getRouteProp = (expressApp: any, prop: string) =>
    expressApp._router.stack                 // registered routes
        .filter((r: any) => r.route)         // take out all the middleware
        .map((r: any) => r.route[prop]);     // get all the props

describe("router config", () => {
    beforeEach(() => {
        app = express();
    });
    it("should generate express route based on config file", () => {
        // tslint:disable-next-line:no-empty
        const testRoute = createTestRoute("/index", ["GET"], () => {});

        routesToExpress(app, testRoute);

        expect(getRouteProp(app, "path")[0]).to.equal("/index");
    });
    it("should generate correct router method based on config file", () => {
        // tslint:disable-next-line:no-empty
        const testRoute = createTestRoute("/index", ["POST"], () => {});

        routesToExpress(app, testRoute);

        expect(getRouteProp(app, "methods")[0].post).to.equal(true);
    });
    it("returns status OK for request from generated route", () => {
        // tslint:disable-next-line:no-empty
        const testRoute = createTestRoute("/testRequest", ["GET"], () => {});

        routesToExpress(app, testRoute);

        return request(app)
            .get("/testRequest")
            .expect(HTTPStatus.OK);
    });
    it("throws a RouterError if method specified in config doesn't exist", () => {
        // tslint:disable-next-line:no-empty
        const testRoute = createTestRoute("/index", ["REPAIR"], () => {});

        try {
            routesToExpress(app, testRoute);
        } catch (error) {
            expect(error).to.be.instanceOf(RouterMethodError);
        }
    });
    it("should pass parameter to callback func", () => {
        const callback = (params: any) => params.testParam;

        const testParam = "This is a test";

        const testRoute = createTestRoute("/index/:testParam", ["GET"], callback);

        routesToExpress(app, testRoute);

        return request(app)
            .get(`/index/${testParam}`)
            .expect(HTTPStatus.OK)
            .then((res: any) => {
                expect(res.body).to.equal(testParam);
            });
    });
    it("should pass multiple parameters to callback func", () => {
        const callback = (params: any) => params.testParam + params.anotherParam;

        const testParam = "This is a test";
        const secondParam = " This is a second param";

        const testRoute = createTestRoute("/index/:testParam/:anotherParam", ["GET"], callback);

        routesToExpress(app, testRoute);

        return request(app)
            .get(`/index/${testParam}/${secondParam}`)
            .expect(HTTPStatus.OK)
            .then((res: any) => expect(res.body).to.equal(testParam + secondParam));
    });
    it("calls middleware passed in router config", () => {
        const callback = (params: any) => params.testParam + params.anotherParam;

        const middle = sinon.spy();
        const testRoute = createTestRoute("/testRoute", ["GET"], callback, [middle]);

        routesToExpress(app, testRoute);

        return request(app)
            .get(`/testRoute`)
            .expect(HTTPStatus.OK)
            .then(() => expect(middle.called).to.be.eq(true));
    });
    it("generate multiple methods based on config", () => {
        const callback = (params: any) => params.testParam + params.anotherParam;

        const middle = sinon.spy();
        const testRoute = createTestRoute("/testRoute", ["PUT", "DELETE"], callback, [middle]);

        routesToExpress(app, testRoute);

        expect(getRouteProp(app, "methods")[0].put).to.equal(true);
        expect(getRouteProp(app, "methods")[1].delete).to.equal(true);
    });
    it("calls multiple middlewares passed in router config", () => {
        const callback = (params: any) => params.testParam + params.anotherParam;

        const firstMiddleware = sinon.spy();
        const secondMiddleware = sinon.spy();
        const testRoute = createTestRoute("/testRoute", ["GET"], callback, [firstMiddleware, secondMiddleware]);

        routesToExpress(app, testRoute);

        return request(app)
            .get(`/testRoute`)
            .expect(HTTPStatus.OK)
            .then(() => {
                expect(firstMiddleware.called).to.be.eq(true);
                expect(secondMiddleware.called).to.be.eq(true);
            });
    });
});
