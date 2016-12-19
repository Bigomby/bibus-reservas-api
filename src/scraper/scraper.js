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

  getStatus(cb) {
    jsdom.env(
      this.estadoURL,
      ['http://code.jquery.com/jquery.js'],
      (err, window) => {
        if (err) throw new Error(err);

        const salas = createSalas();
        const $ = window.$;
        $('table#table1 tbody tr td')
          .filter(index => index % 7 !== 0)
          .each((index, element) => {
            if (!$(element)) return cb(Error('Can\'t get element'));
            salas[Math.floor(index / 6)].turns[index % 6].available =
              $(element).text() === 'Libre';

            return null;
          });

        if (typeof cb === 'function') cb(null, salas);
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
          nombre: options.nombre,
          uvus: options.uvus,
          correo: options.correo,
          sala: options.sala,
          turno: options.turno,
          fecha: options.fecha,
          btn_reservar: '',
        },
      }, (err, res) => {
        if (err) reject(err);

        resolve(res);
      });
    });
  }
}

module.exports = Scraper;
