const createApp = require('./app.js');
const { appConfig } = require('./common/config.js');
const gracefulShutdown = require('./common/utils.js');

const app = createApp();

const server = app.listen(appConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server ExpressJS is listening on port http://${appConfig.host}:${appConfig.port}/`);
});

process.on('SIGTERM', () => gracefulShutdown(server));
process.on('SIGINT', () => gracefulShutdown(server));
