import IUserProvider from '../../hadron-security/src/IUserProvider';
import IRoleProvider from '../../hadron-security/src/IRoleProvider';
import HadronSecurity from '../../hadron-security/src/HadronSecurity';

const securityConfig = (
  userProvider: IUserProvider,
  roleProvider: IRoleProvider,
): Promise<HadronSecurity> => {
  return new Promise((resolve, reject) => {
    roleProvider.getRoles().then((roles) => {
      const security = new HadronSecurity(userProvider, roleProvider, {
        ALL: roles,
      });
      security
        .allow('/team/*', ['Admin', 'User'])
        .allow('/user/*', ['NotExists', 'ThisDoesNotExistToo', 'Admin', 'Sad']);

      resolve(security);
    });
  });
};

export default securityConfig;
