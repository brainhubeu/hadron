import { IOAuthConfig, IContainer } from './src/types';

import facebookRedirect from './src/facebook/redirect';
import googleRedirect from './src/google/redirect';
import facebookToken from './src/facebook/token';
import googleToken from './src/google/token';

export default {
  facebook: {
    redirect: facebookRedirect,
    token: facebookToken,
  },
  google: {
    redirect: googleRedirect,
    token: googleToken,
  },
};

export const register = (container: IContainer, config: any) => {
  const oauthConfig = config.oauth as IOAuthConfig;

  container.register('oauth', oauthProvider(oauthConfig));
};

const oauthProvider = (oauthConfig: IOAuthConfig) => ({
  facebook: {
    redirect: (state: string) => facebookRedirect(oauthConfig, state),
    token: (code: string) => facebookToken(code, oauthConfig),
  },
  google: {
    redirect: () => googleRedirect(oauthConfig),
    token: (code: string) => googleToken(code, oauthConfig),
  },
});

export { IOAuthConfig, IContainer } from './src/types';
