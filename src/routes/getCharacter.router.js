const { Router } = require('express');
const { getAllCharacters, getCharacterByName, getCharacterBySpecies } = require('../services/getCharacter.service.js');

const router = Router();

// GET todos los personajes
router.get('/', async (req, res, next) => {
  try {
    // No se aceptan query params para listar todos
    if (Object.keys(req.query).length > 0) {
      return res.status(400).json({ code: '400', message: 'No se aceptan parámetros en este endpoint', description: 'Use /characters/name?name=... o /characters/species?species=...'});
    }

    const characters = await getAllCharacters();
    return res.status(200).json(characters);
  } catch (error) {
    return next(error);
  }
});

// GET personaje por nombre
router.get('/name', async (req, res, next) => {
  try {
    const { name } = req.query;
    // Validar parámetro
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ code: '400', message: 'El parámetro "name" es requerido y debe ser string', description: 'Ejemplo: /characters/name?name=Rick' });
    }
    if (Object.keys(req.query).length !== 1) {
      return res.status(400).json({ code: '400', message: 'Parámetros inválidos', description: 'Solo se acepta el parámetro name' });
    }

    const characters = await getCharacterByName(name);
    return res.status(200).json(characters);
  } catch (error) {
    return next(error);
  }
});

// GET personaje por especie
router.get('/species', async (req, res, next) => {
  try {
    const { species } = req.query;
    // Validar parámetro
    if (!species || typeof species !== 'string') {
      return res.status(400).json({ code: '400', message: 'El parámetro "species" es requerido y debe ser string', description: 'Ejemplo: /characters/species?species=Human' });
    }
    if (Object.keys(req.query).length !== 1) {
      return res.status(400).json({ code: '400', message: 'Parámetros inválidos', description: 'Solo se acepta el parámetro species' });
    }

    const characters = await getCharacterBySpecies(species);
    if (!characters || characters.length === 0) {
      return res.status(404).json({ code: '404', message: 'Not found', description: 'No se encontraron personajes con esa especie' });
    }
    return res.status(200).json(characters);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
