import fetch from 'node-fetch';

import { IOAuthConfig } from '../types';
import formatQueryString from '../util/formatQueryString';

import { FACEBOOK_TOKEN_URL } from '../util/constants';

export default (code: string, config: IOAuthConfig): Promise<any> => {
  const host = config.facebook.tokenUrl || FACEBOOK_TOKEN_URL;

  const query = {
    code,
    client_id: config.facebook.clientID,
    client_secret: config.facebook.clientSecret,
    redirect_uri: config.facebook.redirectUri,
  };

  const queryString = formatQueryString(query);

  return fetch(`${host}?${queryString}`).then((res) => res.json());
};
