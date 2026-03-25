const OpenApiValidator = require('express-openapi-validator');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const apiSpec = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/openapi.yaml'), 'utf8'));

const openApiValidator = () => OpenApiValidator.middleware({
  apiSpec,
  validateRequests: true,
  validateResponses: true,
});

module.exports = {
  openApiValidator,
};
