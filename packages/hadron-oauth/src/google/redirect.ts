import { IContainer, IOAuthConfig } from '../types';
import { GOOGLE_AUTH_URL } from '../util/constants';

import formatQueryString from '../util/formatQueryString';

export default (config: IOAuthConfig): string => {
  const host = config.google.authUrl || GOOGLE_AUTH_URL;

  const query = {
    client_id: config.google.clientID,
    redirect_uri: config.google.redirectUri,
    scope: config.google.scope.join(' '),
    response_type: config.google.responseType || 'code',
  };

  const queryString = formatQueryString(query);

  return `${host}?${queryString}`;
};
