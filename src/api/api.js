const bodyParser = require('body-parser');

/**
 * API handles HTTP requests
 * @arg {express app}     Express application
 * @type {winston logger} Winston logger
 */
module.exports = class API {
  constructor(app, scraper, logger, config) {
    this.scraper = scraper;
    this.app = app;
    this.logger = logger;

    this.app.use(bodyParser.json({ type: 'application/json' }));

    this.app.get('/', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug('GET / FROM:', ip);

      res.writeHead(302, {
        Location: config.root,
      });

      res.end();
    });

    this.app.get('/salas', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug('GET /salas FROM:', ip);

      this.scraper.getStatus((err, salas) => {
        if (err) return res.send(500, err);
        return res.send(salas);
      });
    });

    this.app.get('/salas/:id', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug(`GET /salas/${req.params.id} FROM:`, ip);

      this.scraper.getStatus((err, salas) => {
        if (err) return res.send(500, err);

        for (const sala of salas) {
          if (sala.id === req.params.id) return res.send(sala);
        }

        return res.send({});
      });
    });

    this.app.get('/turnos/:id', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug(`GET /turnos/${req.params.id} FROM:`, ip);

      this.scraper.getStatus((err, salas) => {
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

    this.app.post('/reserva', (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.debug('POST /reserva FROM:', ip);

      const fields = ['correo', 'sala', 'turno', 'fecha', 'nombre', 'uvus',
        'usuario', 'password'];
      for (const field of fields) {
        if (!req.body[field]) {
          return res.send({ error: `Missing field: ${field}` });
        }
      }

      const options = {
        nombre: req.body.nombre,
        sala: req.body.sala,
        uvus: req.body.uvus,
        turno: req.body.turno,
        correo: req.body.correo,
        fecha: req.body.fecha,
      };

      scraper.login(req.body.usuario, req.body.password)
        .then(location => scraper.getTicketID(location))
        .then(ticketID => scraper.takeSala(ticketID, options))
        .then(response => res.send(response))
        .catch(err => res.send(err));

      return null;
    });
  }

  listen(port, cb) {
    this.app.listen(port, () => cb());
  }
};
