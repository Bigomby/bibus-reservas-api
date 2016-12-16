/**
 * API handles HTTP requests
 * @arg {express app}     Express application
 * @type {winston logger} Winston logger
 */
module.exports = class API {
  constructor(app, scraper, logger) {
    this.scraper = scraper;
    this.app = app;
    this.logger = logger;

    this.app.get('/salas', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug('GET /salas', ip);
      this.scraper.get((err, salas) => {
        if (err) return res.send(500, err);
        return res.send(salas);
      });
    });

    this.app.get('/salas/:id', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug(`GET /salas/${req.params.id}`, ip);
      this.scraper.get((err, salas) => {
        if (err) return res.send(500, err);

        for (const sala of salas) {
          if (sala.id === req.params.id) return res.send(sala);
        }

        return res.send({});
      });
    });

    this.app.get('/turnos/:id', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug(`GET /turnos/${req.params.id}`, ip);
      this.scraper.get((err, salas) => {
        if (err) return res.send(500, err);
        const turnos = [];

        for (const sala of salas) {
          turnos.push({
            sala: sala.id,
            booked: sala.booked[req.params.id],
          });
        }

        return res.send(turnos);
      });
    });
  }

  listen(port, cb) {
    this.app.listen(port, () => cb());
  }
};
