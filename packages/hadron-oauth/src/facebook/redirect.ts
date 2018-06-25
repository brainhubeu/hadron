import { IContainer, IOAuthConfig } from '../types';
import { FACEBOOK_AUTH_URL } from '../util/constants';

import formatQueryString from '../util/formatQueryString';

export default (config: IOAuthConfig, state?: string): string => {
  const host = config.facebook.authUrl || FACEBOOK_AUTH_URL;

  const query = {
    client_id: config.facebook.clientID,
    redirect_uri: config.facebook.redirectUri,
    scope: config.facebook.scope.join(','),
    response_type: config.facebook.responseType || 'code',
    state: state || '',
  };

  const queryString = formatQueryString(query);

  return `${host}?${queryString}`;
};
