import { IOAuthConfig, IContainer } from './src/types';

import facebookRedirect from './src/facebook/redirect';
import googleRedirect from './src/google/redirect';
import githubRedirect from './src/github/redirect';
import facebookToken from './src/facebook/token';
import googleToken from './src/google/token';
import githubToken from './src/github/token';

export default {
  facebook: {
    redirect: facebookRedirect,
    token: facebookToken,
  },
  google: {
    redirect: googleRedirect,
    token: googleToken,
  },
  github: {
    redirect: githubRedirect,
    token: githubToken,
  },
};

const oauthProvider = (oauthConfig: IOAuthConfig) => ({
  facebook: {
    redirect: (state?: string) => facebookRedirect(oauthConfig, state),
    token: (code: string) => facebookToken(code, oauthConfig),
  },
  google: {
    redirect: () => googleRedirect(oauthConfig),
    token: (code: string) => googleToken(code, oauthConfig),
  },
  github: {
    redirect: (state?: string) => githubRedirect(oauthConfig),
    token: (code: string, state?: string) =>
      githubToken(code, oauthConfig, state),
  },
});

export const register = (container: IContainer, config: any) => {
  const oauthConfig = config.oauth as IOAuthConfig;

  container.register('oauth', oauthProvider(oauthConfig));
};

export { IOAuthConfig, IContainer } from './src/types';
