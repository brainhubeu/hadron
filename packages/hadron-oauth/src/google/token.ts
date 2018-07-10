import fetch from 'node-fetch';

import { IOAuthConfig } from '../types';
import formatQueryString from '../util/formatQueryString';

import { GOOGLE_TOKEN_URL } from '../util/constants';

export default (code: string, config: IOAuthConfig): Promise<any> => {
  const host = config.google.tokenUrl || GOOGLE_TOKEN_URL;

  const query = {
    code,
    client_id: config.google.clientID,
    client_secret: config.google.clientSecret,
    redirect_uri: config.google.redirectUri,
    grant_type: config.google.grantType || 'authorization_code',
  };

  return fetch(host, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: formatQueryString(query),
  }).then((res) => res.json());
};
