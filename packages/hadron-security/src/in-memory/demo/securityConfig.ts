import HadronSecurity from '../../HadronSecurity';
import InMemoryUserProvider from '../InMemoryUserProvider';
import InMemoryRoleProvider from '../InMemoryRoleProvider';

const securityConfig = (): Promise<HadronSecurity> => {
  const userProvider = new InMemoryUserProvider();
  const roleProvider = new InMemoryRoleProvider();

  return new Promise((resolve, reject) => {
    roleProvider.addRole({ id: 1, name: 'Admin' });
    roleProvider.addRole({ id: 2, name: 'User' });
    roleProvider.addRole({ id: 3, name: 'Manager' });

    const roleHierarchy = {
      ADMIN: ['Admin'],
      USER: ['User'],
      ALL: ['Admin', 'User'],
    };

    roleProvider.getRole('Admin').then((role) => {
      userProvider.addUser({
        id: 1,
        username: 'admin',
        passwordHash:
          '$2b$10$sLo5GdVD5t1EcHK2mtIU7.UsVHb6GhXUEwoRrEeOZu7vgkhx5ogOW',
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

    roleProvider.getRole('Manager').then((role) => {
      userProvider.addUser({
        id: 4,
        username: 'manager',
        passwordHash: 'manager',
        roles: [role],
      });
    });

    const security = new HadronSecurity(
      userProvider,
      roleProvider,
      roleHierarchy,
    );

    security
      .allow('/user', 'User', ['post', 'get', 'put'])
      .allow('/admin/*', ['Admin'], ['post', 'get'])
      .allow('/adm', [['User', 'Admin'], 'Manager'], ['post'])
      .allow('/all', ['Admin', 'User'], ['post'])
      .allow('/qwe', ['NotExists', 'Admin', 'Guest', 'Manager'])
      .allow('/zxc', ['Guest', 'Owner', 'User']);

    resolve(security);
  });
};

export default securityConfig;
