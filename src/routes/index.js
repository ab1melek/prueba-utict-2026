const { Router } = require('express');
const GetCharacterRouter = require('./getCharacter.router.js');
const { NOMBRES, ESPECIES } = require('../services/constantes.js');

function routerApi(app) {
  const router = Router();
  app.use('/api/v1', router);
  
  const health = (req, res) => {
    res.sendStatus(200);
  };

  router.get('/', health);

  // Catálogos directamente en /api/v1
  router.get('/catalogo/nombres', (req, res) => {
    res.json({ nombres: NOMBRES });
  });

  router.get('/catalogo/especies', (req, res) => {
    res.json({ especies: Object.keys(ESPECIES) });
  });

  // Router de characters montado bajo /characters
  router.use('/characters', GetCharacterRouter);
}

module.exports = routerApi;
