import { expect } from 'chai';
import {
  initRoutes,
  ISecuredRoute,
  getRouteFromPath,
  getExistsingRoute,
  createNewRoute,
  getMethodsForExistsingRoute,
} from '../../HadronAuth';
import { convertToPattern } from '../../helpers/urlGlob';

describe('Hadron Authorization module', () => {
  it('initRoutes should return array of prepared IRoute from ISecuredRoute array', () => {
    const securedRoutes: ISecuredRoute[] = [
      {
        path: '/admin/**',
        methods: ['POST', 'PUT'],
        roles: ['Admin', 'User'],
      },
    ];

    const routes = initRoutes(securedRoutes);

    expect(routes).to.be.instanceOf(Array);
    expect(Object.keys(routes[0])).to.be.deep.equal(['path', 'methods']);
  });

  it('initRoutes should join two same paths with different methods/roles', () => {
    const securedRoutes: ISecuredRoute[] = [
      {
        path: '/admin/**',
        methods: ['POST', 'PUT'],
        roles: 'Admin',
      },
      {
        path: '/admin/**',
        methods: ['GET'],
        roles: 'User',
      },
    ];

    const routes = initRoutes(securedRoutes);

    expect(routes.length).to.be.equal(1);
    expect(Object.keys(routes[0])).to.be.deep.equal(['path', 'methods']);
  });

  it('initRoutes should convert path from securedRoute to regex pattern', () => {
    const securedRoutes: ISecuredRoute[] = [
      {
        path: '/admin/*',
        methods: ['POST'],
        roles: 'Admin',
      },
    ];

    const routes = initRoutes(securedRoutes);
    const matcher = new RegExp(routes[0].path);
    const testPath = '/admin/1';

    expect(matcher.test('admin/1')).to.be.equal(true);
  });

  describe('getRouteFromPath', () => {
    const routes = initRoutes([
      {
        path: '/admin/*',
        methods: ['POST'],
        roles: 'Admin',
      },
      {
        path: '/user/*',
        methods: ['POST'],
        roles: 'Admin',
      },
    ]);

    it('getRouteFromPath should return IRoute if path is already exists by regex in routes', () => {
      expect(getRouteFromPath('/admin/1', routes)).to.be.an('object');
    });

    it('getRouteFromPath should return null if path does not exists by regex in routes', () => {
      expect(getRouteFromPath('/qwe', routes)).to.be.equal(null);
    });
  });

  describe('getExistingRoute', () => {
    const routes = initRoutes([
      {
        path: '/admin/*',
        methods: ['POST'],
        roles: 'Admin',
      },
      {
        path: '/user/*',
        methods: ['POST'],
        roles: 'Admin',
      },
    ]);

    it('getExistingRoute should return route if route exists in array', () => {
      expect(
        getExistsingRoute(convertToPattern('/admin/*'), routes),
      ).to.be.equal(routes[0]);
    });

    it('getExistingRoute should return null if route does not exists in array', () => {
      expect(
        getExistsingRoute(convertToPattern('/guest/*'), routes),
      ).to.be.equal(null);
    });
  });

  describe('createNewRoute', () => {
    const path = '/admin/**';
    const methods: string[] = [];
    const roles = 'Admin';

    const route = createNewRoute(path, methods, roles);
    it('createNewRoute should create IRoute from path, methods and roles', () => {
      expect(Object.keys(route)).to.be.deep.equal(['path', 'methods']);
    });

    it('createNewRoute should create regex pattern from path string', () => {
      expect(route.path).to.be.equal(convertToPattern('/admin/**'));
    });

    it('createNewRoute should push "*" to methods array if array is empty', () => {
      expect(route.methods[0].name).to.be.equal('*');
    });

    it('createNewRoute should create IMethod with name and roles in route object', () => {
      expect(Object.keys(route.methods[0])).to.be.deep.equal([
        'name',
        'allowedRoles',
      ]);
    });
  });

  describe('getMethodsForExistingRoute', () => {
    const path = '/admin/**';
    const methods: string[] = ['GET'];
    const roles = 'Admin';

    const route = createNewRoute(path, methods, roles);

    it('getMethodsForExistsinRoute should push new methods to existing route', () => {
      const newMethods = getMethodsForExistsingRoute(
        route,
        ['POST', 'PUT'],
        ['User', 'Admin', 'Guest'],
      );

      expect(newMethods.length).to.be.equal(3);
    });

    it('getMethodsForExistsinRoute should push new roles to existing method', () => {
      const newMethods = getMethodsForExistsingRoute(
        route,
        ['GET'],
        ['User', 'Guest'],
      );

      expect(newMethods.length).to.be.equal(1);
    });
  });
});
