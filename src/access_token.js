/* eslint-disable no-console */

import spotifyApi from './services/spotify';
import { question, handleError } from './tools/utils';

const scopes = ['user-read-private', 'playlist-modify-private'];
const authorizationUrl = spotifyApi.createAuthorizeURL(scopes);

console.log(`
Open next url on browser: ${authorizationUrl}

> Copy and paste generated Authorization Code
`);

question('Ingress authorization code')
  .then(authorizationCode => spotifyApi.authorizationCodeGrant(authorizationCode))
  .then(({ body }) => body)
  .then(({ access_token: accessToken, refresh_token: refreshToken }) =>
    console.log(`
Add both token to .env file
  - ACCESS_TOKEN: ${accessToken}
  - REFRESH_TOKEN: ${refreshToken}
`),
  )
  .catch(handleError);
