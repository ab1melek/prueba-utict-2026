const { AxiosError } = require('axios');

// Middleware tipo error para loggear errores
function logErrors(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  // Mostrar la bitacora de error del servidor para monitorear
  next(err);
}

// eslint-disable-next-line no-unused-vars
function notFoundHandler(req, res, next) {
  res.status(404).json({
    code: '404',
    message: 'Not found',
    description: 'El recurso especificado no existe',
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output, data } = err;
    const response = {
      code: output.payload.statusCode.toString(),
      message: output.payload.error,
      description: output.payload.message,
    };
    if (data?.rowDetails) {
      response.rowDetails = data.rowDetails;
    }
    res.status(output.statusCode).json(response);
  } else {
    next(err);
  }
}

function clientHttpErrorHandler(err, req, res, next) {
  if (err instanceof AxiosError) {
    const { response } = err;
    res.status(response.status).json({
      code: response.status.toString(),
      message: err.code,
      description: err.description,
    });
  } else {
    next(err);
  }
}

function schemaErrorHandler(err, req, res, next) {
  if (err.status === 400) {
    res.status(400).json({
      code: '400',
      message: 'Error de validación de contrato',
      description: err.message,
      details: err.errors,
    });
    return;
  }

  if (err.status === 500) {
    res.status(500).json({
      code: '500',
      message: 'Error de validación de contrato',
      description: err.message,
      details: err.errors,
    });
    return;
  }
  next(err);
}

// ORM / DB-specific errors (e.g., Sequelize)
function ormErrorHandler(err, req, res, next) {
  if (err && err.name && err.name.startsWith('Sequelize')) {
    res.status(500).json({
      code: '500',
      message: 'Database error',
      description: err.message,
    });
    return;
  }
  next(err);
}

// Generic error handler (final middleware)
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    code: (err.status || 500).toString(),
    message: err.message || 'Internal server error',
    description: err.description || null,
  });
}

module.exports = {
  logErrors,
  notFoundHandler,
  boomErrorHandler,
  clientHttpErrorHandler,
  schemaErrorHandler,
  ormErrorHandler,
  errorHandler,
};
