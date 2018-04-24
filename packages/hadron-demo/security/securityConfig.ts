import HadronSecurity, {
  IUserProvider,
  IRoleProvider,
} from '@brainhubeu/hadron-security';

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
        .allow('/team/*', [['Admin', 'User'], 'Manager'])
        .allow(
          '/user/*',
          ['NotExists', 'ThisDoesNotExistsToo', 'User', 'Admin'],
          ['get'],
        )
        .allow('/user/*', 'Admin', ['post', 'put', 'delete'])
        .allow('/qwe', ['DoesNotExists']);

      resolve(security);
    });
  });
};

export default securityConfig;
