const winston = require('winston');

const Scraper = require('../../src/scraper/scraper');
const config = require('../../config/config');

const scraper = new Scraper(config.scraper);
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: config.logger.level,
      colorize: true,
      prettyPrint: true,
    }),
  ],
});

function getAll(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.debug('GET /salas FROM:', ip);

  scraper.getStatus((err, salas) => {
    if (err) return res.send(500, err);
    return res.send(salas);
  });
}

function get(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.debug(`GET /salas/${req.params.id} FROM:`, ip);

  scraper.getStatus((err, salas) => {
    if (err) return res.send(500, err);

    for (const sala of salas) {
      if (sala.id === req.swagger.params.roomID.value) {
        return res.send(sala);
      }
    }

    return res.status(500).send({
      message: `sala ${req.swagger.params.roomID.value} not found`,
    });
  });
}

module.exports = { get, getAll };
