import { expect } from 'chai';
import * as nock from 'nock';

import generateRedirectUrl from '../google/redirect';
import requestToken from '../google/token';

let config = {
  google: {
    clientID: 'keyboard-cat',
    clientSecret: 'shhh',
    redirectUri: 'http://localhost:8080',
    scope: ['https://www.googleapis.com/auth/userinfo.profile'],
  },
};

// @TODO: Errors and bad inputs.
describe('google', function() {
  it('generates a valid redirect url', function() {
    const url = generateRedirectUrl(config);
    expect(new URL(url)).to.be.ok;
  });

  it('exchanges auth code for url', function(done) {
    nock('https://www.googleapis.com')
      .post('/oauth2/v4/token', (body: any) => {
        if (
          body.code &&
          body.client_id &&
          body.client_secret &&
          body.grant_type
        ) {
          return true;
        }
      })
      .reply(200, { access_token: 'bearhaslanded' });

    requestToken('code', config).then((json) => {
      expect(json.access_token).to.be.equal('bearhaslanded');
      done();
    });
  });
});
