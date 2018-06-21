import { expect } from 'chai';
import * as nock from 'nock';

import generateRedirectUrl from '../facebook/redirect';
import requestToken from '../facebook/token';

const config = {
  facebook: {
    clientID: 'keyboard-cat',
    clientSecret: 'shhh',
    redirectUri: 'http://localhost:8080',
    scope: ['profile'],
  },
};

// @TODO: Errors and bad inputs.
describe('facebook', function() {
  it('generates a valid redirect url', function() {
    const url = generateRedirectUrl(config);
    expect(new URL(url)).to.be.ok;
  });

  it('exchanges auth code for url', function(done) {
    nock('https://graph.facebook.com')
      .get('/v3.0/oauth/access_token')
      .query((body: any) => {
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
