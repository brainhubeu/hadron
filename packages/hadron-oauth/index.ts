export { IOAuthConfig } from './src/types';

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
