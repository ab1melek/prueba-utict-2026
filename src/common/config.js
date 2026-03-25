const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
const env = process.env.NODE_ENV || 'dev';
const envFile = `.env.${env}`;

dotenv.config({ path: envFile, override: true });

const timeout = 60000;

const appConfig = {
  env,
  isProd: env === 'production',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
};

module.exports = {
  appConfig,
};
