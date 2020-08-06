#!/usr/bin/env node

import spotifyApi from './services/spotify';
import { handleError, firstDayOfWeek, YYYYMMDDFormat } from './tools/utils';
import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from './config';

/** ****************************************
 * Functions
 */

function extractTrackUri(data) {
  return data.body.tracks.items.map((i) => i.track.uri);
}

function extractBody({ body }) {
  return body;
}

spotifyApi.setAccessToken(SPOTIFY_ACCESS_TOKEN);
spotifyApi.setRefreshToken(SPOTIFY_REFRESH_TOKEN);

const discoverWeeklyPlaylist = 'Discover Weekly';
const playlistName = `Lista Semanal ${YYYYMMDDFormat(firstDayOfWeek())}`;
const playlistOptions = {
  public: false,
};

(async () => {
  let username = null; // eslint-disable-line no-unused-vars

  try {
    const { id } = await spotifyApi.getMe().then(extractBody);
    username = id;
  } catch (e) {
    const { access_token: accessToken } = await spotifyApi.refreshAccessToken().then(extractBody);
    spotifyApi.setAccessToken(accessToken);

    const { id } = await spotifyApi.getMe().then(extractBody);
    username = id;
  }

  try {
    const { playlists } = await spotifyApi
      .searchPlaylists(discoverWeeklyPlaylist)
      .then(extractBody);
    const weeklyPlaylist = playlists.items[0];

    const [playlist, tracks] = await Promise.all([
      spotifyApi.createPlaylist(username, playlistName, playlistOptions).then(extractBody),
      spotifyApi.getPlaylist(weeklyPlaylist.owner.id, weeklyPlaylist.id).then(extractTrackUri),
    ]);

    await spotifyApi.addTracksToPlaylist(playlist.owner.id, playlist.id, tracks);
  } catch (e) {
    handleError(e);
  }
})();
