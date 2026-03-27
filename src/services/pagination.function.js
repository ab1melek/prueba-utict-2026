const axios = require('axios');

const ITEMS_PER_PAGE = 10;

// Requiere page y lo devuelve con limit de 10 por página
async function fetchPaged(endpoint, params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, String(v));
  });

  const url = `${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const { data } = await axios.get(url);

  // Limita a 10 resultados por página
  return {
    ...data,
    results: (data.results || []).slice(0, ITEMS_PER_PAGE),
  };
}

module.exports = { fetchPaged };
