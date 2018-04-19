import { expect } from 'chai';
import HadronSecurity from '../../HadronSecurity';
import InMemoryRoleProvider from '../../in-memory/InMemoryRoleProvider';
import InMemoryUserProvider from '../../in-memory/InMemoryUserProvider';

describe('In memory hadron security', () => {
  const userProvider = new InMemoryUserProvider();
  const roleProvider = new InMemoryRoleProvider();

  roleProvider.addRole({ id: 1, name: 'Admin' });
  roleProvider.addRole({ id: 2, name: 'User' });
  roleProvider.addRole({ id: 3, name: 'Guest' });

  userProvider.addUser({
    id: 1,
    username: 'admin',
    passwordHash: 'admin',
    roles: [roleProvider.getRole('Admin')],
  });

  userProvider.addUser({
    id: 2,
    username: 'user',
    passwordHash: 'user',
    roles: [roleProvider.getRole('User')],
  });

  userProvider.addUser({
    id: 3,
    username: 'uberAdmin',
    passwordHash: 'qwe',
    roles: [roleProvider.getRole('Admin'), roleProvider.getRole('User')],
  });

  userProvider.addUser({
    id: 4,
    username: 'guest',
    passwordHash: 'guest',
    roles: [roleProvider.getRole('Guest')],
  });

  const roleHierarchy = {
    ADMIN: ['Admin'],
    USER: ['User'],
    GUEST: ['Guest'],
    ALL: ['Admin', 'User', 'Guest'],
  };

  const security = new HadronSecurity(
    userProvider,
    roleProvider,
    roleHierarchy,
  );

  security.allow('/api', 'Admin');
  security.allow('/api', 'Guest');
  security.allow('/api', 'Admin');
  security.allow('/admin/*', 'Admin');
  security.allow('/uber', [['Admin', 'User'], 'Guest']);

  security.allow('/blog', ['Admin', 'User']);

  it('should return true if user is allowed to route', () => {
    expect(
      security.isAllowed(
        '/api',
        'get',
        userProvider.loadUserByUsername('admin'),
      ),
    ).to.be.equal(true);
  });

  it('should return false if user is not allowed to route', () => {
    expect(
      security.isAllowed(
        '/api',
        'get',
        userProvider.loadUserByUsername('user'),
      ),
    ).to.be.equal(false);
  });

  it('should throw an error if path is not supported in security', () => {
    try {
      security.isAllowed(
        '/qwe',
        'get',
        userProvider.loadUserByUsername('user'),
      );
    } catch (error) {
      expect(error).to.be.instanceof(Error);
    }
  });

  it('should throw an error if user does not exists.', () => {
    try {
      security.isAllowed(
        '/api',
        'get',
        userProvider.loadUserByUsername('user2'),
      );
    } catch (error) {
      expect(error).to.be.instanceof(Error);
    }
  });

  it('should return true if user is allowe to route', () => {
    expect(
      security.isAllowed(
        '/admin/abc',
        'get',
        userProvider.loadUserByUsername('admin'),
      ),
    ).to.be.equal(true);
    expect(
      security.isAllowed(
        'admin/wqe-xc1',
        'get',
        userProvider.loadUserByUsername('admin'),
      ),
    ).to.be.equal(true);
  });

  it('should throw an error if non strict url does not exists.', () => {
    try {
      security.isAllowed(
        'admin/qwe/1',
        'get',
        userProvider.loadUserByUsername('admin'),
      );
    } catch (error) {
      expect(error).to.be.instanceof(Error);
    }
  });

  it('should return true if user is allowed to route', () => {
    expect(
      security.isAllowed(
        '/blog',
        'get',
        userProvider.loadUserByUsername('user'),
      ),
    ).to.be.equal(true);
  });

  it('should return true if user have Admin AND User role OR Guest role', () => {
    expect(
      security.isAllowed(
        '/uber',
        'get',
        userProvider.loadUserByUsername('uberAdmin'),
      ),
    ).to.be.equal(true);
    expect(
      security.isAllowed(
        '/uber',
        'get',
        userProvider.loadUserByUsername('guest'),
      ),
    ).to.be.equal(true);
  });
});
