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

    let pageNum;
    if (page !== undefined) {
      const parsed = Number(page);
      if (!Number.isInteger(parsed) || parsed < 1) {
        return res.status(400).json({
          code: '400',
          message: 'Parámetro page inválido',
          description: 'page debe ser entero >= 1',
        });
      }
      pageNum = parsed;
    }

    let result;
    if (name) {
      result = await getCharacterByName(name, pageNum);
    } else if (species) {
      result = await getCharacterBySpecies(species, pageNum);
    } else {
      result = await getAllCharacters(pageNum);
    }

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
