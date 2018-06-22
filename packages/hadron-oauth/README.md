## Installation

`npm install --save @brainhubeu/hadron-oauth`

## Overview

`hadron-oauth` is a Hadron utility package to simplify working with OAuth providers, such as Google and Facebook. It provides several utility functions that you can use to make writing OAuth2 authentication quicker and more streamlined.

## Tutorial

### Understanding OAuth flow

The plan for our authentication flow is as follows:

* The client makes a `GET` request to `/auth/{provider}` to begin the process of authentication.
* The server redirects the client to a provider consent site.
* The client receives an auth code.
* The client makes a `POST` request to `/auth/{provider}/token` to exchange the auth code for an access token.

We can then use the access token to make further request to the provider's API in order to fetch data about the user (such as their name or email).

### Configuration

We will need to provide certain information to `hadron-oauth` before we can proceed with the auth process. This information exists in Hadron's config file.

```js
// oauth.js
module.exports = {
  google: {
    clientID: 'keyboard-cat',
    clientSecret: 'shhh',
    scope: ['https://www.googleapis.com/auth/userinfo.profile'],
    redirectUri: 'http://localhost:8081/',
  },
};
```

The `clientID` and `clientSecret` fields need to be the same as these given to you by your provider (such as the Google API Console). The `redirectUri` must be exactly the same as the one given to your provider.

`scope` is an array of strings defining the scopes your app requires from the user. See the [Google scopes](https://developers.google.com/identity/protocols/googlescopes) and [Facebook scopes](https://developers.facebook.com/docs/facebook-login/permissions/) for details. These can be used later to retrieve relevant data from your provider's APIs about the user.

In this case, we'll also pretend that there is a dev server for React or Vue at `http://localhost:8081`, however we can just as well redirect the calls back to our own server.

It's recommended that you exclude this file from your version control or supply the specific config fields through environment variables as this file contains sensitive information.

### Registration

Now that our config is created, we need to create our Hadron app entry point.

```js
// index.js
const hadron = require('@brainhubeu/hadron-core').default;
const hadronExpress = require('@brainhubeu/hadron-express');
const hadronOauth = require('@brainhubeu/hadron-oauth');

const express = require('express');
const oauthConfig = require('./oauth.js');

const app = express();

const config = {
  oauth: oauthConfig,
  routes: {
    root: {
      path: '/',
      methods: ['GET'],
      callback: () => 'Hello!',
    },
  },
};

hadron(app, [hadronExpress, hadronOauth], config).then(() => {
  app.listen(8080, () => {
    console.log('Hadron/Express listening on 8080.');
  });
});
```

We now have access to the OAuth methods through the container.

### Auth code route

Let's create a separate file to store the logic for our route endpoints. We'll first create a route to redirect to the consent screen.

```js
// routes.js
const routes = {
  googleAuthRequest: {
    path: '/auth/google',
    methods: ['GET'],
    callback: (req, { oauth }) => ({
      redirect: oauth.google.redirect(),
    }),
  },
};

module.exports = routes;
```

```js
// index.js
const oauthRoutes = require('./routes');
// ...
const config = {
  routes: {
    root: {
      // ...
    },
    ...oauthRoutes,
  },
};
```

Now, whenever a client calls the `/auth/google` endpoint, he or she will be redirected to the Google auth consent page.

### Handling the auth code

Now, we'll delve into the client side here for a minute, because we need to send the auth code that the client receives back to the server.

In the `oauth.js` config file we defined a redirect to our front-end dev server. We now need to send the authorization code from that server back to our app.

We can do it like this:

```js
// client side javascript
const url = new URL(window.location);
const params = new URLSearchParams(url.search);
const code = params.get('code');

if (!code) return;

fetch('http://localhost:8080/auth/google/token', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ code }),
}).then((res) => {
  // ...
});
```

### Exchanging the code for an access token.

We'll define another route to exchange the auth code for an access token.

```js
// routes.js
const routes = {
  googleAuthRequest: {
    // ...
  },
  googleTokenRequest: {
    path: '/auth/google/token',
    methods: ['POST'],
    callback: (req, { oauth }) => {
      oauth.google.token(req.body.code).then((res) => {
        console.log(res.access_token);
        // do things with the token...
      });
    },
  },
};

module.exports = routes;
```

Now that we have the access token we can implement other features, such as our own authentication. We can also call the Google API in the name of the user to pull any relevant information we need.

## Reference

### Config

#### `google.`

* `clientID: string` - your app id as provided by the [Google API Console](https://console.cloud.google.com/apis/credentials).
* `clientSecret: string` - your app secret from the Google API Console
* `scope: string[]` - an array of strings listing the [scope URLs](https://developers.google.com/identity/protocols/googlescopes) you need for your app.
* `redirectUri: string` - redirect URI for your app, must be exactly the same as the one you chose in Google API Console.
* `authUrl: ?string` - an optional parameter to provide a different auth URL to Google (for instance if the current one was to stop working). Defaults to `https://accounts.google.com/o/oauth2/v2/auth`.
* `tokenUrl: ?string` - an optional parameter to provide a different token exchange Google API endpoint. Defaults to `https://www.googleapis.com/oauth2/v4/token`.
* `responseType: ?string` - if Google was to support a different kind of OAuth authentication flow, we could specify the response type here. Currently, it only supports `code` and so it defaults to that.
* `grantType: ?string` - similarly to the point above, if Google was to support a different kind of OAuth authentication flow, we could specify the grant type here. Defaults to `authorization_code`.

#### `facebook.`

* `clientID: string` - your app id as provided by the [App Dashboard](https://developers.facebook.com/apps/).
* `clientSecret: string` - your app secret from the App Dashboard.
* `scope: string[]` - an array of strings listing [Facebook API scopes](https://developers.facebook.com/docs/facebook-login/permissions/).
* `redirectUri: string` - the redirect URI for your app, must be the same as in the App Dashboard.
* `authUrl: ?string` - see above, defaults to `https://www.facebook.com/v3.0/dialog/oauth`.
* `tokenUrl: ?string` - see above, defaults to `https://graph.facebook.com/v3.0/oauth/access_token`
* `responseType` - see above, defaults to `code`.

### Methods

#### `oauth.google.`

* `redirect() => string` - parses the config options and returns a redirect URL to the user consent screen.
* `token(code: string) => Promise` - exchanges the auth code in the first argument for an access token. Returns a promise which resolves to the response from Google.

#### `oauth.facebook.`

* `redirect(state: ?string) => string` - parses the config and returns a redirect URL to the user consent screen. You can provide a state string to secure your app against CSRF ([see here for details](https://developers.facebook.com/docs/facebook-login/security/#stateparam)).
* `token(code: string) => Promise` - exchanges the auth code in the first argument for an access token. Returns a promise which resolves to the repsonse from Facebook.
