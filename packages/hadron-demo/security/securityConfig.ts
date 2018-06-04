import HadronSecurity, {
  IUserProvider,
  IRoleProvider,
} from '@brainhubeu/hadron-security';

const securityConfig = (
  userProvider: IUserProvider,
  roleProvider: IRoleProvider,
): Promise<HadronSecurity> => {
  return new Promise((resolve, reject) => {
    const security = new HadronSecurity(userProvider, roleProvider);

    security
      .secureAllRoutes()
      .allow('/team/*', [['Admin', 'User'], 'Manager'])
      .allow(
        '/user/*',
        ['NotExists', 'ThisDoesNotExistsToo', 'User', 'Admin'],
        ['get'],
      )
      .allow('/user/*', 'Admin', ['post', 'put', 'delete'])
      .allow('/qwe', ['DoesNotExists'])
      .allow('/zxc')
      .authenticateByUsernameAndPassword();

    resolve(security);
  });
};

export default securityConfig;
