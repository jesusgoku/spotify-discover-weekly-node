#!/usr/bin/env node

import spotifyApi from './services/spotify';
import { handleError, firstDayOfWeek, YYYYMMDDFormat } from './tools/utils';

/** ****************************************
 * Functions
 */

function extractTrackUri(data) {
  return data.body.tracks.items.map(i => i.track.uri);
}

function extractPlaylistId(data) {
  return data.body;
}

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

const discoverWeeklyPlaylist = 'Discover Weekly';
const playlistName = `Lista Semanal ${YYYYMMDDFormat(firstDayOfWeek())}`;
const playlistOptions = {
  public: false,
};

spotifyApi
  .getMe()
  .catch(() =>
    spotifyApi
      .refreshAccessToken()
      .then(({ body }) => body)
      .then(({ access_token: accessToken }) => spotifyApi.setAccessToken(accessToken)),
  )
  .then(() =>
    Promise.all([
      spotifyApi.getMe().then(res => res.body.id),
      spotifyApi.searchPlaylists(discoverWeeklyPlaylist).then(res => res.body.playlists.items[0]),
    ]),
  )
  .then(([username, weeklyPlaylist]) => ({
    username,
    weeklyPlaylist,
  }))
  .then(({ username, weeklyPlaylist }) =>
    Promise.all([
      spotifyApi.createPlaylist(username, playlistName, playlistOptions).then(extractPlaylistId),
      spotifyApi.getPlaylist(weeklyPlaylist.owner.id, weeklyPlaylist.id).then(extractTrackUri),
    ]),
  )
  .then(([playlist, tracks]) => ({
    playlist,
    tracks,
  }))
  .then(({ playlist, tracks }) =>
    spotifyApi.addTracksToPlaylist(playlist.owner.id, playlist.id, tracks),
  )
  .catch(handleError);
