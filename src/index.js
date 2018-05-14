#!/usr/bin/env node

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

const discoverWeeklyPlaylist = 'Discover Weekly';
const playlistName = `Lista Semanal ${YYYYMMDDFormat(firstDayOfWeek())}`;
const playlistOptions = { public: false };
const scopes = ['user-read-private', 'playlist-modify-private' ];

// const authorizationUrl = spotifyApi.createAuthorizeURL(scopes);
// console.log(authorizationUrl);

// spotifyApi
//   .authorizationCodeGrant(process.env.AUTHORIZATION_CODE)
//   .then(handleConsoleAndReturn)
//   .catch(handleError)
// ;

// spotifyApi
//   .refreshAccessToken()
//   .then(handleConsoleAndReturn)
//   .catch(handleError)
// ;

spotifyApi
  .getMe()
  .catch(() => spotifyApi.refreshAccessToken().then(res => updateAccessToken(spotifyApi)))
  .then(() => Promise.all([
    spotifyApi.getMe().then(res => res.body.id),
    spotifyApi.searchPlaylists(discoverWeeklyPlaylist).then(res => res.body.playlists.items[0]),
  ]))
  .then(data => ({ username: data[0], weeklyPlaylist: data[1] }))
  .then(data => Promise.all([
    spotifyApi.createPlaylist(data.username, playlistName, playlistOptions).then(extractPlaylistId),
    spotifyApi.getPlaylist(data.weeklyPlaylist.owner.id, data.weeklyPlaylist.id).then(extractTrackUri),
  ]))
  .then(data => ({ playlist: data[0], tracks: data[1] }))
  .then(data => spotifyApi.addTracksToPlaylist(data.playlist.owner.id, data.playlist.id, data.tracks))
  .catch(handleError)
;

/******************************************
 * Functions
 */
function handleError(err) {
  console.error(err);
}

function handleConsoleAndReturn(data) {
  console.log(data);
  return data;
}

function firstDayOfWeek(initialDate = null) {
  const d = initialDate ? new Date(initialDate) : new Date();
  const daysSub = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + daysSub);
  return d;
}

function YYYYMMDDFormat(d) {
  const month = d.getMonth() + 1;
  const date = d.getDate();
  return `${d.getFullYear()}${month < 10 ? '0' + month : month}${date < 10 ? '0' + date : date}`;
}

function extractTrackUri(data) {
  return data
    .body
    .tracks
    .items
    .map(i => i.track.uri)
  ;
}

function extractPlaylistId(data) {
  return data.body;
}

function updateAccessToken(spotifyApi) {
  return res => spotifyApi.setAccessToken(res.body['access_token']);
}
