const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
const env = process.env.NODE_ENV || 'dev';
const envFile = `.env.${env}`;

dotenv.config({ path: envFile, override: true });

const appConfig = {
  env,
  isProd: env === 'production',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  apiBase: process.env.API_BASE,
};

const apiRickAndMorty = {
  characterEndpoint: process.env.CHARACTER_ENDPOINT,
}

module.exports = {
  appConfig,
  apiRickAndMorty,
};
