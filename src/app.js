const express = require('express');
const { json } = require('express');
const os = require('os');
const path = require('path');
const routerApi = require('./routes/index.js');
const { appConfig } = require('./common/config.js');
const {
  logErrors, notFoundHandler, errorHandler, boomErrorHandler, ormErrorHandler, clientHttpErrorHandler, schemaErrorHandler,
} = require('./middlewares/error.handler.js');
// const { openApiValidator } = require('./middlewares/openapi.handler.js');
// const { initDatabase } = require('./db/init.js');

const createApp = () => {
  const app = express();
  app.disable('x-powered-by');

  app.get('/', (req, res) => {
    res.json({
      environment: appConfig.env,
      containerId: os.hostname(),
    });
  });

  // Body parser primero
  app.use(json());

  // Servir assets estáticos del front (public)
  app.use('/static', express.static(path.join(__dirname, '..', 'public')));

  // Endpoint que inyecta la configuración pública para el front
  app.get('/config.js', (req, res) => {
    const apiBase = process.env.API_BASE || `http://${appConfig.host}:${appConfig.port}/api/v1`;
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`window.API_BASE = '${apiBase}';`);
  });

  // Validator ANTES de definir rutas (para validar requests)
  // app.use(openApiValidator());

  // Montar rutas
  routerApi(app);

  // Middlewares de errores específicos
  app.use(schemaErrorHandler);
  app.use(logErrors);
  app.use(notFoundHandler);
  app.use(boomErrorHandler);
  app.use(ormErrorHandler);
  app.use(clientHttpErrorHandler);
  app.use(errorHandler);

  // initDatabase();

  return app;
};

module.exports = createApp;
