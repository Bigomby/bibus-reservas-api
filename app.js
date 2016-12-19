const SwaggerExpress = require('swagger-express-mw');
const express = require('express');

const config = require('./config/config');

const app = express();

SwaggerExpress.create(config.api, (err, swaggerExpress) => {
  if (err) throw err;

  swaggerExpress.register(app);
  app.listen(config.api.port, () => {
    console.log('Escuchando en puerto', config.api.port);
  });
});

module.exports = app;
