/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getTicketID"] }] */

const jsdom = require('jsdom');
const request = require('request');
const cookie = require('cookie');

const timeTable = {
  A: {
    1: '8:00 - 10:30',
    2: '10:30 - 12:30',
    3: '12:30 - 14:30',
    4: '14:30 - 16:30',
    5: '16:30 - 18:30',
    6: '18:30 - 21:00',
  },
  B: {
    1: '8:00 - 11:00',
    2: '11:00 - 13:00',
    3: '13:00 - 15:00',
    4: '15:00 - 17:00',
    5: '17:00 - 19:00',
    6: '19:00 - 21:00',
  },
};

function createSalas() {
  const salas = [];
  const salasID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  const turnosID = [1, 2, 3, 4, 5, 6];

  for (const salaID of salasID) {
    const sala = {
      id: salaID,
      turns: [],
    };

    for (const turnoID of turnosID) {
      sala.turns.push({
        id: turnoID,
        time: salaID <= 6 ? timeTable.A[turnoID] : timeTable.B[turnoID],
        available: false,
      });
    }

    salas.push(sala);
  }

  return salas;
}

let instance = null;

class Scraper {
  constructor(options) {
    if (!instance) {
      if (!options) throw new Error('No options provided');

      instance = this;
      this.estadoURL = options.estadoURL;
      this.loginURL = options.loginURL;
      this.reservaURL = options.reservaURL;
    }

    return instance;
  }

  getStatus() {
    return new Promise((resolve, reject) => {
      request.get({ url: this.estadoURL }, (err, res, body) => {
        if (err) return reject(err);

        jsdom.env(body, ['http://code.jquery.com/jquery.js'],
          (domError, window) => {
            if (domError) return reject(domError);

            const salas = createSalas();
            const $ = window.$;
            const data = $('table#table1 tbody tr td');
            if (data.length === 0) {
              return reject('No salas found');
            }

            data
              .filter(index => index % 7 !== 0)
              .each((index, element) => {
                if (!$(element)) return reject('Can\'t get element');

                salas[Math.floor(index / 6)].turns[index % 6].available =
                  $(element).text() === 'Libre';

                return null;
              });

            return resolve(salas);
          });

        return null;
      });
    });
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      request.post({
        url: this.loginURL,
        form: {
          adAS_i18n_theme: 'es',
          adAS_mode: 'authn',
          adAS_username: username,
          adAS_password: password,
        },
      }, (loginError, loginResponse) => {
        if (loginError) reject(loginError);

        resolve(loginResponse.headers.location);
      });
    });
  }

  getTicketID(location) {
    return new Promise((resolve, reject) => {
      request.post({
        url: location,
      }, (err, response) => {
        if (err) reject(err);

        resolve(cookie.parse(response.headers['set-cookie'].pop()).PHPSESSID);
      });
    });
  }

  takeSala(ticketID, options) {
    return new Promise((resolve, reject) => {
      const sessionID = `PHPSESSID=${ticketID}`;
      const jar = request.jar();
      jar.setCookie(sessionID, this.reservaURL);

      request.post({
        url: this.reservaURL,
        jar,
        form: {
          nombre: options.name,
          uvus: options.uvus,
          correo: options.email,
          sala: options.room,
          turno: options.turn,
          fecha: options.date,
          btn_reservar: '',
        },
      }, (err) => {
        if (err) return reject(err);

        return resolve(ticketID);
      });
    });
  }

  getReservationID(ticketID, date) {
    return new Promise((resolve, reject) => {
      if (!date) return reject('No date provided');
      if (!ticketID) return reject('No Ticket ID provided');

      const sessionID = `PHPSESSID=${ticketID}`;
      const jar = request.jar();
      jar.setCookie(sessionID, this.reservaURL);

      request.post({
        url: this.reservaURL,
        jar,
        form: {
          sl_tipo: 1,
          sl_fecha: date,
        },
      }, (err, res) => {
        if (err) return reject(err);

        jsdom.env(
          res.body,
          ['http://code.jquery.com/jquery.js'],
          (jsdomError, window) => {
            if (jsdomError) reject(jsdomError);

            const $ = window.$;
            const dateElements = $('select#sl_fecha option');

            dateElements.each((dateIndex, dateElement) => {
              // Check if the server response date matches the query date

              if ($(dateElement).attr('selected') === 'selected') {
                if (date !== $(dateElement).attr('value')) {
                  return reject('Invalid date');
                }

                const elements = $('table#table1 tbody tr td a');
                if (elements.length === 0) return reject('Empty table');

                elements.each((index, element) => {
                  // substring is needed because of an unknown first character
                  // (the icon)
                  if ($(element).text().substring(1) === 'Cancelar') {
                    const salas = createSalas();
                    resolve({
                      room: salas[Math.floor(index / 6)].id,
                      turn: salas[Math.floor(index / 6)].turns[index % 6].id,
                      time: salas[Math.floor(index / 6)].turns[index % 6].time,
                      reservation: $(element).attr('href').split('/')[3],
                      date,
                    });
                  }

                  if (index >= elements.length - 1) {
                    resolve(null);
                  }
                });
              }

              if (dateIndex >= dateElements.length - 1) {
                return reject('Invalid date');
              }

              return null;
            });

            return null;
          });

        return null;
      });

      return null;
    });
  }

  cancel(ticketID, reservationID) {
    return new Promise((resolve, reject) => {
      if (!ticketID) return reject('No Ticket ID provided');
      if (!reservationID) return reject('No Reservation ID provided');

      const sessionID = `PHPSESSID=${ticketID}`;
      const jar = request.jar();
      jar.setCookie(sessionID, this.reservaURL);

      request.post({
        url: this.reservaURL,
        jar,
        form: {
          reserva_id: reservationID,
          btn_cancelar: '',
        },
      }, (err, res) => {
        if (err) return reject(err);

        jsdom.env(
          res.body,
          ['http://code.jquery.com/jquery.js'],
          (jsdomError, window) => {
            if (jsdomError) reject(jsdomError);

            const $ = window.$;
            const elements = $('table#table1 tbody tr td a');
            if (elements.length === 0) return reject('Empty table found');

            elements.each((index, element) => {
              // substring is needed because of an unknown first character
              if ($(element).text().substring(1) === 'Cancelar') {
                reject('Resevation could not be cancelled');
              }

              if (index >= elements.length - 1) {
                resolve(null);
              }
            });

            return null;
          });

        return null;
      });

      return null;
    });
  }
}

module.exports = Scraper;
