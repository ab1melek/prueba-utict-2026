const { Router } = require('express');
const GetCharacterRouter = require('./getCharacter.router.js');

function routerApi(app) {
  const router = Router();
  app.use('/api/v1', router);
  const health = (req, res) => {
    res.sendStatus(200);
  };

  router.get('/', health);
  router.use('/characters', GetCharacterRouter);
}

module.exports = routerApi;
