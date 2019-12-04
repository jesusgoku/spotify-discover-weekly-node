/* eslint-disable no-console */

import spotifyApi from './services/spotify';
import { question, handleError } from './tools/utils';

const scopes = ['user-read-private', 'playlist-modify-private'];
const authorizationUrl = spotifyApi.createAuthorizeURL(scopes);

console.log(`
Open next url on browser: ${authorizationUrl}

> Copy and paste generated Authorization Code
`);

(async () => {
  try {
    const authorizationCode = await question('Ingress authorization code');
    const { body } = await spotifyApi.authorizationCodeGrant(authorizationCode);
    const { access_token: accessToken, refresh_token: refreshToken } = body;

    console.log(`
    Add both token to .env file
      - ACCESS_TOKEN: ${accessToken}
      - REFRESH_TOKEN: ${refreshToken}
    `);
  } catch (e) {
    handleError(e);
  }
})();
