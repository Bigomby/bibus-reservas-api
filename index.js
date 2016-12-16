const express = require('express');
const winston = require('winston');

const config = require('./config/config');
const API = require('./src/api/api');
const Scraper = require('./src/scraper/scraper');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: config.logger.level,
      colorize: true,
      prettyPrint: true,
    }),
  ],
});
const app = express();
const scraper = new Scraper(config.scraper);
const api = new API(app, scraper, logger);

api.listen(config.server.port,
  () => logger.info(`API listening on ${config.server.port}`));
