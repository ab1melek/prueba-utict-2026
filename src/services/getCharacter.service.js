const axios = require('axios');
const Boom = require('@hapi/boom');
const { apiRickAndMorty } = require('../common/config.js');

const { characterEndpoint: CHARACTER_ENDPOINT } = apiRickAndMorty;

function mapCharacters(characters) {
  return characters.map((char) => ({
    imagen: char.image,
    nombre: char.name,
    especie: char.species,
  }));
}

/**
 * Obtiene todos los personajes
 * @returns {Array} Array con {image, name, species}
 */
async function getAllCharacters() {
  try {
    const response = await axios.get(CHARACTER_ENDPOINT);
    return mapCharacters(response.data.results);
  } catch (error) {
    throw Boom.internal(`Error al obtener personajes: ${error.message}`);
  }
}

/**
 * Busca personaje por nombre
 * @param {string} name - Nombre del personaje
 * @returns {Array} Array con {image, name, species}
 */
async function getCharacterByName(name) {
  if (!name || typeof name !== 'string') {
    throw Boom.badRequest('El parámetro "name" es requerido y debe ser string');
  }
  try {
    const response = await axios.get(`${CHARACTER_ENDPOINT}/?name=${encodeURIComponent(name)}`);
    return mapCharacters(response.data.results);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw Boom.notFound('No se encontraron personajes con ese nombre');
    }
    throw Boom.internal(`Error al buscar por nombre: ${error.message}`);
  }
}

/**
 * Busca personajes por especie
 * @param {string} species - Especie del personaje
 * @returns {Array} Array con {image, name, species}
 */
async function getCharacterBySpecies(species) {
  if (!species || typeof species !== 'string') {
    throw Boom.badRequest('El parámetro "species" es requerido y debe ser string');
  }
  try {
    const response = await axios.get(`${CHARACTER_ENDPOINT}/?species=${encodeURIComponent(species)}`);
    return mapCharacters(response.data.results);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw Boom.notFound('No se encontraron personajes con esa especie');
    }
    throw Boom.internal(`Error al buscar por especie: ${error.message}`);
  }
}

module.exports = { getAllCharacters, getCharacterByName, getCharacterBySpecies };
