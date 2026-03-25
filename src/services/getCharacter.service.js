const axios = require('axios');
const { CHARACTER_ENDPOINT } = require('./constants.js');

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
    throw new Error(`Error al obtener personajes: ${error.message}`);
  }
}

/**
 * Busca personaje por nombre
 * @param {string} name - Nombre del personaje
 * @returns {Array} Array con {image, name, species}
 */
async function getCharacterByName(name) {
  try {
    const response = await axios.get(`${CHARACTER_ENDPOINT}/?name=${name}`);
    return mapCharacters(response.data.results);
  } catch (error) {
    throw new Error(`Error al buscar por nombre: ${error.message}`);
  }
}

/**
 * Busca personajes por especie
 * @param {string} species - Especie del personaje
 * @returns {Array} Array con {image, name, species}
 */
async function getCharacterBySpecies(species) {
  try {
    const response = await axios.get(`${CHARACTER_ENDPOINT}/?species=${species}`);
    return mapCharacters(response.data.results);
  } catch (error) {
    throw new Error(`Error al buscar por especie: ${error.message}`);
  }
}

module.exports = { getAllCharacters, getCharacterByName, getCharacterBySpecies };
