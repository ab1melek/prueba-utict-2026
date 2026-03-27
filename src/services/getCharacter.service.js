const Boom = require('@hapi/boom');
const { apiRickAndMorty } = require('../common/config.js');
const { fetchPaged } = require('./pagination.function.js');
const { NOMBRES, ESPECIES } = require('./constantes.js');
const baseResponse = require('./base.response.js');

const { characterEndpoint: CHARACTER_ENDPOINT } = apiRickAndMorty;

// Mapeo inverso: inglés -> español
const speciesInverse = Object.fromEntries(
  Object.entries(ESPECIES).map(([es, en]) => [en, es])
);

function mapCharacters(characters) {
  return characters.map((char) => ({
    imagen: char.image,
    nombre: char.name,
    especie: speciesInverse[char.species] || char.species,
  }));
}

// Obtiene personajes con paginación
async function getAllCharacters(page = 1) {
  try {
    const params = { page };
    const raw = await fetchPaged(CHARACTER_ENDPOINT, params);
    const pagination = {
      pages: raw.info?.pages ?? null,
      next: raw.info?.next ?? null,
      prev: raw.info?.prev ?? null,
    };

    return baseResponse(mapCharacters(raw.results || []), pagination);
  } catch (error) {
    throw Boom.internal(`Error al obtener personajes: ${error.message}`);
  }
}

// Busca por nombre en catálogo válido
async function getCharacterByName(name, page = 1) {
  if (!name || typeof name !== 'string' || !NOMBRES.includes(name)) {
    throw Boom.badRequest(`Nombre inválido. Válidos: ${NOMBRES.join(', ')}`);
  }
  try {
    const params = { name, page };
    const raw = await fetchPaged(CHARACTER_ENDPOINT, params);
    const pagination = {
      pages: raw.info?.pages ?? null,
      next: raw.info?.next ?? null,
      prev: raw.info?.prev ?? null,
    };

    return baseResponse(mapCharacters(raw.results || []), pagination);
  } catch (error) {
    if (error.isBoom) throw error;
    if (error.response?.status === 404) {
      throw Boom.notFound('Sin resultados para este nombre');
    }
    throw Boom.internal(`Error al buscar por nombre: ${error.message}`);
  }
}

// Busca por especie en catálogo válido (español -> inglés)
async function getCharacterBySpecies(speciesSpanish, page = 1) {
  if (!speciesSpanish || !ESPECIES[speciesSpanish]) {
    throw Boom.badRequest(`Especie inválida. Válidas: ${Object.keys(ESPECIES).join(', ')}`);
  }
  try {
    const speciesEnglish = ESPECIES[speciesSpanish];
    const params = { species: speciesEnglish, page };
    const raw = await fetchPaged(CHARACTER_ENDPOINT, params);
    const pagination = {
      pages: raw.info?.pages ?? null,
      next: raw.info?.next ?? null,
      prev: raw.info?.prev ?? null,
    };

    return baseResponse(mapCharacters(raw.results || []), pagination);
  } catch (error) {
    if (error.isBoom) throw error;
    if (error.response?.status === 404) {
      throw Boom.notFound('Sin resultados para esta especie');
    }
    throw Boom.internal(`Error al buscar por especie: ${error.message}`);
  }
}

module.exports = { getAllCharacters, getCharacterByName, getCharacterBySpecies };
