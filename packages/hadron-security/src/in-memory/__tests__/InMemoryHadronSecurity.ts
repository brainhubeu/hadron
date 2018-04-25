import { expect } from 'chai';
import HadronSecurity from '../../HadronSecurity';
import InMemoryRoleProvider from '../../in-memory/InMemoryRoleProvider';
import InMemoryUserProvider from '../../in-memory/InMemoryUserProvider';
import IUserProvider from '../../IUserProvider';
import IRoleProvider from '../../IRoleProvider';

const securityConfig = (
  userProvider: IUserProvider,
  roleProvider: IRoleProvider,
): Promise<HadronSecurity> => {
  return new Promise((resolve, reject) => {
    roleProvider.addRole({ id: 1, name: 'Admin' });
    roleProvider.addRole({ id: 2, name: 'User' });
    roleProvider.addRole({ id: 3, name: 'Guest' });

    roleProvider.getRole('Admin').then((role) => {
      userProvider.addUser({
        id: 1,
        username: 'admin',
        passwordHash: 'admin',
        roles: [role],
      });
    });

    roleProvider.getRole('User').then((role) => {
      userProvider.addUser({
        id: 2,
        username: 'user',
        passwordHash: 'user',
        roles: [role],
      });
    });

    Promise.all([
      roleProvider.getRole('Admin'),
      roleProvider.getRole('User'),
    ]).then((roles) => {
      userProvider.addUser({
        roles,
        id: 3,
        username: 'uberAdmin',
        passwordHash: 'qwe',
      });
    });

    roleProvider.getRole('Guest').then((role) => {
      userProvider.addUser({
        id: 4,
        username: 'guest',
        passwordHash: 'guest',
        roles: [role],
      });
    });

    const roleHierarchy = {
      ADMIN: ['Admin'],
      USER: ['User'],
      GUEST: ['Guest'],
      ALL: ['Admin', 'User', 'Guest'],
    };

    const security = new HadronSecurity(userProvider, roleProvider);

    security.allow('/api', 'Admin');
    security.allow('/api', 'Guest');
    security.allow('/api', 'Admin');
    security.allow('/admin/*', 'Admin');
    security.allow('/uber', [['Admin', 'User'], 'Guest']);

    security.allow('/blog', ['Admin', 'User']);
    security.allow('/admi', 'Admin').allow('/adm', 'User');

    resolve(security);
  });
};

const userProvider = new InMemoryUserProvider();
const roleProvider = new InMemoryRoleProvider();

securityConfig(userProvider, roleProvider).then((security) => {
  describe('In memory hadron security', () => {
    it('should return true if user is allowed to route', async () => {
      const user = await userProvider.loadUserByUsername('admin');
      expect(security.isAllowed('/api', 'get', user)).to.be.equal(true);
    });

    it('should return falise if user is not allowed to route', async () => {
      const user = await userProvider.loadUserByUsername('user');
      expect(security.isAllowed('/api', 'get', user)).to.be.equal(false);
    });

    it('should return null if path is not supported by security', async () => {
      expect(security.getRouteFromPath('/qwe')).to.be.equal(null);
    });

    it('should throw an error if path is not supported in security', async () => {
      const user = await userProvider.loadUserByUsername('user');
      try {
        security.isAllowed('/qwe', 'get', user);
      } catch (error) {
        expect(error).to.be.instanceof(Error);
      }
    });

    it('should throw an error if user does not exists.', async () => {
      try {
        await userProvider.loadUserByUsername('definitely not exists');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
      }
    });

    it('should return true if user is allowe to route', async () => {
      const user = await userProvider.loadUserByUsername('admin');
      expect(security.isAllowed('/admin/abc', 'get', user)).to.be.equal(true);
    });

    it('should throw an error if non strict url does not exists.', async () => {
      const user = await userProvider.loadUserByUsername('admin');
      try {
        security.isAllowed('/admin/qwe/1', 'get', user);
      } catch (error) {
        expect(error).to.be.instanceof(Error);
      }
    });

    it('should return true if user is allowed to route', async () => {
      const user = await userProvider.loadUserByUsername('user');
      expect(security.isAllowed('/blog', 'get', user)).to.be.equal(true);
    });

    it('should return true if user have Admin AND User role OR Guest role', async () => {
      const uberAdmin = await userProvider.loadUserByUsername('uberAdmin');
      const guest = await userProvider.loadUserByUsername('guest');
      expect(security.isAllowed('/uber', 'get', uberAdmin));
      expect(security.isAllowed('/uber', 'get', guest));
    });
  });
});
