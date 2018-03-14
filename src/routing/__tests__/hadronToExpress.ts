import { expect } from "chai";

import * as express from "express";
import * as fs from "fs-extra";
import * as HTTPStatus from "http-status";
import * as multer from "multer";
import * as R from "ramda";
import * as sinon from "sinon";
import * as request from "supertest";

import { json as bodyParser } from "body-parser";
import RouterMethodError from "../../errors/RouterMethodError";
import routesToExpress from "../hadronToExpress";

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
        app.use(bodyParser());
    });
    describe("generating routes", () => {
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
        it("generate multiple methods based on config", () => {
            const callback = (req: any, res: any) => req.params.testParam + req.params.anotherParam;

            const middle = sinon.spy();
            const testRoute = createTestRoute("/testRoute", ["PUT", "DELETE"], callback, [middle]);

            routesToExpress(app, testRoute);

            expect(getRouteProp(app, "methods")[0].put).to.equal(true);
            expect(getRouteProp(app, "methods")[1].delete).to.equal(true);
        });
    });
    describe("router params", () => {
        it("should pass parameter to callback func", () => {
            const callback = (valueA: any) => valueA;

            const testParam = "This is a test";

            const testRoute = createTestRoute("/index/:valueA", ["GET"], callback);

            routesToExpress(app, testRoute);

            return request(app)
                .get(`/index/${testParam}`)
                .expect(HTTPStatus.OK)
                .then((res: any) => {
                    expect(res.body).to.equal(testParam);
                });
        });
        it("should pass parameter to callback func v2", () => {
            const callback = (valueA: any) => valueA;

            const testParam = "This is a test";

            const testRoute = createTestRoute("/index", ["GET"], callback);

            routesToExpress(app, testRoute);

            return request(app)
                .get(`/index?valueA=${testParam}`)
                .expect(HTTPStatus.OK)
                .then((res: any) => {
                    expect(res.body).to.equal(testParam);
                });
        });
        it("should pass multiple parameters to callback func", () => {
            const callback = (valueA: string, valueB: string) => valueA + valueB;

            const testParam = "This is a test";
            const secondParam = " This is a second param";

            const testRoute = createTestRoute("/index/:valueA/:valueB", ["GET"], callback);

            routesToExpress(app, testRoute);

            return request(app)
                .get(`/index/${testParam}/${secondParam}`)
                .expect(HTTPStatus.OK)
                .then((res: any) => expect(res.body).to.equal(testParam + secondParam));
        });
        it("should pass multiple parameters to callback func v2", () => {
            const callback = (valueA: string, valueB: string) => valueA + valueB;

            const testParam = "This is a test";
            const secondParam = " This is a second param";

            const testRoute = createTestRoute("/index", ["GET"], callback);

            routesToExpress(app, testRoute);

            return request(app)
                .get(`/index?valueA=${testParam}&valueB=${secondParam}`)
                .expect(HTTPStatus.OK)
                .then((res: any) => expect(res.body).to.equal(testParam + secondParam));
        });
        it("should pass query to callback func", () => {
            const callback = (foo: any) => foo;

            const testQuery = "bar";
            const testRoute = createTestRoute("/index", ["GET"], callback);

            routesToExpress(app, testRoute);

            return request(app)
                .get(`/index/?foo=${testQuery}`)
                .expect(HTTPStatus.OK)
                .then((res) => {
                    expect(res.body).to.equal(testQuery);
                });
        });
        it("should pass body to callback func", () => {
            const callback = (body: any) => body.testData;

            const postData = {
                testData: "some value",
            };

            const testRoute = createTestRoute("/index", ["POST"], callback);

            routesToExpress(app, testRoute);

            return request(app)
                .post(`/index`)
                .send(postData)
                .expect(HTTPStatus.OK)
                .then((res) => {
                    expect(res.body).to.equal(postData.testData);
                });
        });
    });
    describe("router middleware", () => {
        it("calls middleware passed in router config", () => {
            const callback = () => {};

            const spy = sinon.spy();

            const middle = (req: any, res: any, next: any) => {
                spy();
                next();
            };

            const testRoute = createTestRoute("/testRoute", ["GET"], callback, [middle]);

            routesToExpress(app, testRoute);

            return request(app)
                .get(`/testRoute`)
                .expect(HTTPStatus.OK)
                .then(() => expect(spy.called).to.be.eq(true));
        });
        it("calls multiple middlewares passed in router config", () => {
            const callback = () => {};

            const firstSpy = sinon.spy();
            const secondSpy = sinon.spy();

            const firstMiddleware = (req: any, res: any, next: any) => {
                firstSpy();
                next();
            };

            const secondMiddleware = (req: any, res: any, next: any) => {
                secondSpy();
                next();
            };

            const testRoute = createTestRoute("/testRoute", ["GET"], callback, [firstMiddleware, secondMiddleware]);

            routesToExpress(app, testRoute);

            return request(app)
                .get(`/testRoute`)
                .expect(HTTPStatus.OK)
                .then(() => {
                    expect(firstSpy.called).to.be.eq(true);
                    expect(secondSpy.called).to.be.eq(true);
                });
        });
    });
    describe("file handling", () => {
        const upload = multer({ dest: "./src/routing/__tests__/testUploads/" });

        const callback = (req: any) => req;

        const uploadMiddleware = (req: any, res: any, next: any)  => {
            return upload.any()(req, res, next);
        };

        after(() => {
            fs.remove(__dirname + "/testUploads");
        });
        it("should save file passed to route", () => {
            const testRoute = createTestRoute("/testUploads", ["POST"], callback, [uploadMiddleware]);

            routesToExpress(app, testRoute);
            const mockDir = __dirname + "/testUploads";

            return request(app)
                .post("/testUploads")
                .attach("image", __dirname + "/mocks/sample.jpg")
                .expect(HTTPStatus.OK)
                .then(() => {
                    const files = fs.readdirSync(mockDir);
                    expect(files.length).to.equal(1);
                });
        });
        it("should pass file to callback func", () => {
            const testRoute = createTestRoute("/testUpload", ["POST"], callback, [uploadMiddleware]);

            routesToExpress(app, testRoute);

            return request(app)
                .post("/testUpload")
                .attach("image", __dirname + "/mocks/sample.jpg")
                .expect(HTTPStatus.OK)
                .then((res) => {
                    expect(R.omit(["filename", "path"], res.body[0])).to.eql(
                        {
                            destination: "./src/routing/__tests__/testUploads/",
                            encoding: "7bit",
                            fieldname: "image",
                            mimetype: "image/jpeg",
                            originalname: "sample.jpg",
                            size: 76178,
                        });
                });
        });
    });
});
