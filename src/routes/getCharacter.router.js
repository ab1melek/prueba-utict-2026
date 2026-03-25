const { Router } = require('express');
const { getAllCharacters, getCharacterByName, getCharacterBySpecies } = require('../services/getCharacter.service.js');

const router = Router();

// GET todos los personajes
router.get('/', async (req, res, next) => {
  try {
    const { name, species } = req.query;
    if (name) {
      const characters = await getCharacterByName(name);
      return res.status(200).json(characters);
    }

    if (species) {
      const characters = await getCharacterBySpecies(species);
      return res.status(200).json(characters);
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
    const characters = await getCharacterBySpecies(species);
    return res.status(200).json(characters);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
