import { expect } from 'chai';
import * as nock from 'nock';
import * as url from 'url';

import generateRedirectUrl from '../github/redirect';
import requestToken from '../github/token';

const config = {
  github: {
    clientID: 'keyboard-cat',
    clientSecret: 'shhh',
    redirectUri: 'http://localhost:8080',
    scope: ['user'],
  },
};

// @TODO: Errors and bad inputs.
describe('github', function() {
  it('generates a valid redirect url', function() {
    const uri = generateRedirectUrl(config);
    expect(url.parse(uri)).to.be.ok;
  });

  it('exchanges auth code for url', function(done) {
    nock('https://github.com')
      .post('/login/oauth/access_token', (body: any) => {
        if (
          body.code &&
          body.client_id &&
          body.client_secret &&
          body.redirect_uri
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
