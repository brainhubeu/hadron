import fetch from 'node-fetch';

import { IOAuthConfig } from '../types';

import { GITHUB_TOKEN_URL } from '../util/constants';

export default (
  code: string,
  config: IOAuthConfig,
  state?: string,
): Promise<any> => {
  const host = config.github.tokenUrl || GITHUB_TOKEN_URL;

  const query = {
    code,
    state,
    client_id: config.github.clientID,
    client_secret: config.github.clientSecret,
    redirect_uri: config.github.redirectUri,
  };

  return fetch(host, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(query),
  }).then((res) => res.json());
};
