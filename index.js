const express = require('express');
const winston = require('winston');

const Router = require('./src/api');

const PORT = 8080 || process.env.PORT;
const DEBUG = false || process.env.DEBUG;

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: DEBUG ? 'debug' : 'info',
      colorize: true,
      prettyPrint: true,
    }),
  ],
});
const app = express();
const api = new Router(app, logger);

api.listen(PORT, () => logger.info(`API listening on ${PORT}`));
