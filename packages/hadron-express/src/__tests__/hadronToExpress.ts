import { expect } from 'chai';

import * as express from 'express';
import * as fs from 'fs-extra';
import * as HTTPStatus from 'http-status';
import * as multer from 'multer';
import * as R from 'ramda';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { Container } from '@brainhubeu/hadron-core';

import { json as bodyParser } from 'body-parser';

import InvalidRouteMethodError from '../errors/InvalidRouteMethodError';
import NoRouterMethodSpecifiedError from '../errors/NoRouterMethodSpecifiedError';

import routesToExpress from '../hadronToExpress';
import { IRequest, IResponseSpec } from '../types';

let app = express();

const createTestRoute = (
  path: string,
  methods: string[],
  callback: (req: IRequest, dependencies: any) => IResponseSpec,
  middleware?: Array<(req: any, res: any, next: any) => any>,
) => ({
  routes: {
    testRoute: {
      callback,
      methods,
      middleware,
      path,
    },
  },
});

const getRouteProp = (expressApp: any, prop: string) =>
  expressApp._router.stack // registered routes
    .filter((r: any) => r.route) // take out all the middleware
    .map((r: any) => r.route[prop]); // get all the props

describe('router config', () => {
  beforeEach(() => {
    app = express();
    app.use(bodyParser());
    Container.register('server', app);
    Container.register('eventManager', null);
  });

  describe('generating routes', () => {
    it('should generate express route based on config file', () => {
      const testRoute = createTestRoute('/index', ['GET'], () => null);

      routesToExpress(testRoute, Container);

      expect(getRouteProp(app, 'path')[0]).to.equal('/index');
    });

    it('should generate correct router method based on config file', () => {
      const testRoute = createTestRoute('/index', ['POST'], () => null);

      routesToExpress(testRoute, Container);

      expect(getRouteProp(app, 'methods')[0].post).to.equal(true);
    });

    it('returns status OK for request from generated route', () => {
      const testRoute = createTestRoute('/testRequest', ['GET'], () => null);

      routesToExpress(testRoute, Container);

      return request(app)
        .get('/testRequest')
        .expect(HTTPStatus.OK);
    });

    it('throws a NoRouterMethodSpecifiedError if no methods were specified', () => {
      const testRoute = createTestRoute('/index', [], () => null);

      try {
        routesToExpress(testRoute, Container);
      } catch (error) {
        expect(error).to.be.instanceOf(NoRouterMethodSpecifiedError);
      }
    });

    it("throws a InvalidRouteMethodError if method specified in config doesn't exist", () => {
      const testRoute = createTestRoute('/index', ['REPAIR'], () => null);

      try {
        routesToExpress(testRoute, Container);
      } catch (error) {
        expect(error).to.be.instanceOf(InvalidRouteMethodError);
      }
    });

    it('generate multiple methods based on config', () => {
      const callback = (req: any, res: any) =>
        req.params.testParam + req.params.anotherParam;

      const middle = sinon.spy();
      const testRoute = createTestRoute(
        '/testRoute',
        ['PUT', 'DELETE'],
        callback,
        [middle],
      );

      routesToExpress(testRoute, Container);

      expect(getRouteProp(app, 'methods')[0].put).to.equal(true);
      expect(getRouteProp(app, 'methods')[1].delete).to.equal(true);
    });

    it('should return HTTP Status 500 if callback is not defined', () => {
      const testRoute = createTestRoute('/testRoute', ['GET'], null);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/testRoute`)
        .expect(HTTPStatus[500]);
    });

    it('calls emitEvent method', () => {
      const eventManager = {
        emitEvent: sinon.spy(),
      };
      Container.register('eventManager', eventManager);
      const testRoute = createTestRoute('/index', ['GET'], () => null);

      routesToExpress(testRoute, Container);
      return request(app)
        .get(`/index`)
        .then(() => {
          expect(eventManager.emitEvent.calledOnce).to.equal(true);
        });
    });

    it('should load routes using json-provider and load them', () => {
      routesToExpress(
        {
          routePaths: [
            [
              './packages/hadron-express/src/__tests__/__mocks__/routes/*',
              'js',
            ],
          ],
        },
        Container,
      );

      return request(app)
        .get(`/`)
        .then(() => {
          expect(getRouteProp(app, 'path')[0]).to.equal('/');
        });
    });
  });

  describe('router params', () => {
    it('should pass parameter to callback func - request param', () => {
      const callback = ({ params }) => params.valueA;

      const testParam = 'This is a test';

      const testRoute = createTestRoute('/index/:valueA', ['GET'], callback);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/index/${testParam}`)
        .expect(HTTPStatus.OK)
        .then((res: any) => {
          expect(res.body).to.equal(testParam);
        });
    });

    it('should pass parameter to callback func - query', () => {
      const callback = ({ query }) => query.valueA;

      const testParam = 'This is a test';

      const testRoute = createTestRoute('/index', ['GET'], callback);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/index?valueA=${testParam}`)
        .expect(HTTPStatus.OK)
        .then((res: any) => {
          expect(res.body).to.equal(testParam);
        });
    });

    it('should pass multiple parameters to callback func - params', () => {
      const callback = ({ params }) => params.valueA + params.valueB;

      const testParam = 'This is a test';
      const secondParam = ' This is a second param';

      const testRoute = createTestRoute(
        '/index/:valueA/:valueB',
        ['GET'],
        callback,
      );

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/index/${testParam}/${secondParam}`)
        .expect(HTTPStatus.OK)
        .then((res: any) => expect(res.body).to.equal(testParam + secondParam));
    });

    it('should pass multiple parameters to callback func - query', () => {
      const callback = ({ query }) => query.valueA + query.valueB;

      const testParam = 'This is a test';
      const secondParam = ' This is a second param';

      const testRoute = createTestRoute('/index', ['GET'], callback);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/index?valueA=${testParam}&valueB=${secondParam}`)
        .expect(HTTPStatus.OK)
        .then((res: any) => expect(res.body).to.equal(testParam + secondParam));
    });

    it('should pass query to callback func', () => {
      const callback = ({ query }) => query.foo;

      const testQuery = 'bar';
      const testRoute = createTestRoute('/index', ['GET'], callback);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/index/?foo=${testQuery}`)
        .expect(HTTPStatus.OK)
        .then((res) => {
          expect(res.body).to.equal(testQuery);
        });
    });

    it('should pass body to callback func', () => {
      const callback = ({ body }) => body.testData;

      const postData = {
        testData: 'some value',
      };

      const testRoute = createTestRoute('/index', ['POST'], callback);

      routesToExpress(testRoute, Container);

      return request(app)
        .post(`/index`)
        .send(postData)
        .expect(HTTPStatus.OK)
        .then((res) => {
          expect(res.body).to.equal(postData.testData);
        });
    });
  });
  describe('router middleware', () => {
    it('calls middleware passed in router config', () => {
      const callback = (): any => null;

      const spy = sinon.spy();

      const middle = (req: any, res: any, next: any) => {
        spy();
        next();
      };

      const testRoute = createTestRoute('/testRoute', ['GET'], callback, [
        middle,
      ]);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/testRoute`)
        .expect(HTTPStatus.OK)
        .then(() => expect(spy.called).to.be.eq(true));
    });

    it('calls multiple middlewares passed in router config', () => {
      const callback = (): any => null;

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

      const testRoute = createTestRoute('/testRoute', ['GET'], callback, [
        firstMiddleware,
        secondMiddleware,
      ]);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/testRoute`)
        .expect(HTTPStatus.OK)
        .then(() => {
          expect(firstSpy.called).to.be.eq(true);
          expect(secondSpy.called).to.be.eq(true);
        });
    });

    it('should return HTTP Status 500 if one of middlewares is null', () => {
      const callback = () => null;

      const testRoute = createTestRoute('/testRoute', ['GET'], callback, [
        null,
      ]);

      routesToExpress(testRoute, Container);

      return request(app)
        .get(`/testRoute`)
        .expect(HTTPStatus[500]);
    });
  });

  describe('file handling', () => {
    const upload = multer({ dest: `${__dirname}/testUploads` });

    const callback = ({ files, file }) => ({ body: files || file });

    const uploadMiddleware = (req: any, res: any, next: any) =>
      upload.any()(req, res, next);

    after(() => {
      fs.remove(`${__dirname}/testUploads`);
    });

    it('should save file passed to route', () => {
      const testRoute = createTestRoute('/testUploads', ['POST'], callback, [
        uploadMiddleware,
      ]);

      routesToExpress(testRoute, Container);
      const mockDir = `${__dirname}/testUploads`;

      return request(app)
        .post('/testUploads')
        .attach('image', `${__dirname}/__mocks__/sample.jpeg`)
        .expect(HTTPStatus.OK)
        .then(() => {
          const files = fs.readdirSync(mockDir);
          expect(files.length).to.equal(1);
        });
    });

    it('should pass file to callback func', () => {
      const testRoute = createTestRoute('/testUpload', ['POST'], callback, [
        uploadMiddleware,
      ]);

      routesToExpress(testRoute, Container);

      return request(app)
        .post('/testUpload')
        .attach('image', `${__dirname}/__mocks__/sample.jpeg`)
        .expect(HTTPStatus.OK)
        .then((res) => {
          expect(R.omit(['filename', 'path', 'size'], res.body[0])).to.eql({
            destination: `${__dirname}/testUploads`,
            encoding: '7bit',
            fieldname: 'image',
            mimetype: 'image/jpeg',
            originalname: 'sample.jpeg',
          });
        });
    });
  });
});
