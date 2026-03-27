const { Router } = require('express');
const { getAllCharacters, getCharacterByName, getCharacterBySpecies } = require('../services/getCharacter.service.js');

const router = Router();

// GET / - Busca por name, species o sin filtros
router.get('/', async (req, res, next) => {
  try {
    const { name, species, page } = req.query;

    if (name && species) {
      return res.status(400).json({
        code: '400',
        message: 'Parámetros inválidos',
        description: 'Proporciona solo uno: name o species'
      });
    }

    let pageNumber;
    if (page !== undefined) {
      const parsed = Number(page);
      if (!Number.isInteger(parsed) || parsed < 1) {
        return res.status(400).json({
          code: '400',
          message: 'Parámetro page inválido',
          description: 'page debe ser entero >= 1',
        });
      }
      pageNumber = parsed;
    }

    let result;
    if (name) {
      result = await getCharacterByName(name, pageNumber);
    } else if (species) {
      result = await getCharacterBySpecies(species, pageNumber);
    } else {
      result = await getAllCharacters(pageNumber);
    }

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
