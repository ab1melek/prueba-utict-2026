/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-extraneous-dependencies */
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import restHandlers from './handlers.js';

const request = require('supertest');
const createApp = require('../../src/app.js');
const { appConfig } = require('../../src/common/config.js');
const { upSeed, downSeed } = require('./umzug.js');

export const server = setupServer(...restHandlers);

let api;
let app;
let localServer;

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

beforeAll(async () => {
  await upSeed();
  app = createApp();
  localServer = app.listen(appConfig.port);
  api = request(app);
});

afterAll(async () => {
  await downSeed();
  localServer.close();
});

export { api };
