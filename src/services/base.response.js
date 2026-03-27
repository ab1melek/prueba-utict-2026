// Construye respuesta: { data, pagination, ...otroMetadata }
function baseResponse(data, pagination = null, metadata = {}) {
  return { data, pagination, ...metadata };
}

module.exports = baseResponse;
