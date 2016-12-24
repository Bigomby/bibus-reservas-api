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

function getReservation(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.debug('GET /reservas/date FROM:', ip);

  scraper
    .login(req.swagger.params.username.value, req.swagger.params.password.value)
    .then(location => scraper.getTicketID(location))
    .then(ticketID => scraper.getReservationID(ticketID, req.swagger.params.date.value))
    .then((reservation) => {
      if (reservation) return res.send(reservation);

      return res.status(404).send({ message: 'Reservation not found' });
    })
    .catch(err => res.status(500).send({ message: err }));
}

function reserve(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.debug('POST /reservas FROM:', ip);

  const reservationInfo = req.swagger.params.reservation.value;

  scraper
    .login(reservationInfo.username, reservationInfo.password)
    .then(location => scraper.getTicketID(location))
    .then((ticketID) => {
      scraper.getReservationID(ticketID, reservationInfo.date)
        .then((reservation) => {
            // If a reservation exists for this date, return error and current
            // reservation info
          if (reservation) {
            res.send(reservation);
            // If there is no reservation, take one
          } else {
            scraper.takeSala(ticketID, {
              name: reservationInfo.name,
              uvus: reservationInfo.uvus,
              email: reservationInfo.email,
              room: reservationInfo.room,
              turn: reservationInfo.turn,
              date: reservationInfo.date,
            }).then(() => {
              scraper.getReservationID(ticketID, reservationInfo.date)
                .then((newReservation) => {
                  res.send(newReservation);
                })
                .catch(err => res.status(500).send({ error: err }));
            });
          }
        })
        .catch((err) => { res.status(500).send({ error: err }); });
    })
    .catch((err) => { res.status(500).send({ error: err }); });
}

function cancel(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.debug('DELETE /reservas FROM:', ip);

  const cancellationInfo = req.swagger.params.cancellation.value;

  scraper
    .login(cancellationInfo.username, cancellationInfo.password)
    .then(location => scraper.getTicketID(location))
    .then(ticketID => scraper.cancel(ticketID, cancellationInfo.reservation))
    .then(() => { res.send({ reservation: cancellationInfo.reservation }); })
    .catch(err => res.status(500).send({ message: err }));
}

module.exports = { getReservation, reserve, cancel };
