import * as winston from "winston";
import Scraper from "../../scraper/scraper";
import config from "../../../config/config";

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
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logger.debug("GET /salas FROM:", ip);

  scraper.getStatus()
    .then(salas => res.send(salas))
    .catch(err => res.send(500, err));
}

function get(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logger.debug(`GET /salas/${req.params.id} FROM:`, ip);

  scraper.getStatus()
    .then((salas: Array<any>) => {
      for (const sala of salas) {
        if (sala.id === req.swagger.params.roomID.value) {
          return res.send(sala);
        }
      }

      return res.status(500).send({
        message: `sala ${req.swagger.params.roomID.value} not found`,
      });
    })
    .catch(err => res.send(500, err));
}

export = { get, getAll };
