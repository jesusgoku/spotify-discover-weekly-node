# Spotify - Backup Weekly List

Backup your personal **Discover Weekly**.

## Setup

```shell
# Install depedencies
yarn install

# If not ACCESS_TOKEN AND REFRESH_TOKEN
yarn run access_token
```

Create config file called `.spotifydwbrc` into current or HOME directory:

```json
{
  "SPOTIFY_CLIENT_ID": "",
  "SPOTIFY_CLIENT_SECRET": "",
  "SPOTIFY_REDIRECT_URI": "",
  "SPOTIFY_ACCESS_TOKEN": "",
  "SPOTIFY_REFRESH_TOKEN": ""
}
```

## Running

```shell
yarn run start
```

## Another tools

```shell
# Check lint and format
yarn run code:check

# Apply lint fix and format
yarn run code:clean

# Only check lint
yarn run code:lint

# Only check format
yarn run code:format
```
