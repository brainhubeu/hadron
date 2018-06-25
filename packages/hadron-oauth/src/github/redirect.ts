import { IContainer, IOAuthConfig } from '../types';
import { GITHUB_AUTH_URL } from '../util/constants';

import formatQueryString from '../util/formatQueryString';
import * as url from 'url';

export default (config: IOAuthConfig, state?: string): string => {
  const host = config.github.authUrl || GITHUB_AUTH_URL;

  const query = {
    client_id: config.github.clientID,
    redirect_uri: config.github.redirectUri,
    scope: config.github.scope.join(','),
    state: state || '',
  };

  const queryString = formatQueryString(query);

  return `${host}?${queryString}`;
};
