import rc from 'rc';
import joi from 'joi';

const moduleName = 'spotifydwb';

const config = rc(moduleName);

const schema = joi.object({
  SPOTIFY_CLIENT_ID: joi.string().trim().required(),
  SPOTIFY_CLIENT_SECRET: joi.string().trim().required(),
  SPOTIFY_REDIRECT_URI: joi.string().trim().pattern(new RegExp('^https?://')).required(),
  SPOTIFY_ACCESS_TOKEN: joi.string().trim().required(),
  SPOTIFY_REFRESH_TOKEN: joi.string().trim().required(),
});

const { error, value: sanitizedConfig } = schema.validate(config, {
  allowUnknown: true,
  stripUnknown: true,
});

if (error) {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
}

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
} = sanitizedConfig;

export {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
};
