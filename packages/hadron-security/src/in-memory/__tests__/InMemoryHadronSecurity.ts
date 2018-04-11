import { expect } from 'chai';
import HadronSecurity from '../../HadronSecurity';
import InMemoryRoleProvider from '../../in-memory/InMemoryRoleProvider';
import InMemoryUserProvider from '../../in-memory/InMemoryUserProvider';

describe.only('In memory hadron security', () => {
  const userProvider = new InMemoryUserProvider();
  const roleProvider = new InMemoryRoleProvider();

  roleProvider.addRole({ id: 1, name: 'Admin' });
  roleProvider.addRole({ id: 2, name: 'User' });
  roleProvider.addRole({ id: 3, name: 'Guest' });

  userProvider.addUser({
    id: 1,
    username: 'admin',
    password: 'admin',
    roles: [roleProvider.getRole('Admin')],
  });
  userProvider.addUser({
    id: 2,
    username: 'user',
    password: 'user',
    roles: [roleProvider.getRole('User')],
  });

  const security = new HadronSecurity();

  security.allow('/api', [roleProvider.getRole('Admin')]);
  security.allow('/api', [roleProvider.getRole('Guest')]);
  security.allow('/api', [roleProvider.getRole('Admin')]);
  security.allow('/admin/*', [roleProvider.getRole('Admin')]);

  security.allow('/blog', [
    roleProvider.getRole('Admin'),
    roleProvider.getRole('User'),
  ]);

  it('should return true if user is allowed to route', () => {
    expect(
      security.isAllowed('/api', userProvider.loadUserByUsername('admin')),
    ).to.be.equal(true);
  });

  it('should return false if user is not allowed to route', () => {
    expect(
      security.isAllowed('/api', userProvider.loadUserByUsername('user')),
    ).to.be.equal(false);
  });

  it('should throw an error if path is not supported in security', () => {
    try {
      security.isAllowed('/qwe', userProvider.loadUserByUsername('user'));
    } catch (error) {
      expect(error).to.be.instanceof(Error);
    }
  });

  it('should throw an error if user does not exists.', () => {
    try {
      security.isAllowed('/api', userProvider.loadUserByUsername('user2'));
    } catch (error) {
      expect(error).to.be.instanceof(Error);
    }
  });

  it('should return true if user is allowe to route', () => {
    expect(
      security.isAllowed(
        '/admin/abc',
        userProvider.loadUserByUsername('admin'),
      ),
    ).to.be.equal(true);
    expect(
      security.isAllowed(
        'admin/wqe-xc1',
        userProvider.loadUserByUsername('admin'),
      ),
    ).to.be.equal(true);
  });

  it('should throw an error if non strict url does not exists.', () => {
    try {
      security.isAllowed(
        'admin/qwe/1',
        userProvider.loadUserByUsername('admin'),
      );
    } catch (error) {
      expect(error).to.be.instanceof(Error);
    }
  });

  it('should return true if user is allowed to route', () => {
    expect(
      security.isAllowed('/blog', userProvider.loadUserByUsername('user')),
    ).to.be.equal(true);
  });
});
