/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getTicketID"] }] */

const jsdom = require('jsdom');
const request = require('request');
const cookie = require('cookie');

function createSalas() {
  return [
    { id: '1',
      booked: [null, null, null, null, null, null],
    },
    { id: '2',
      booked: [null, null, null, null, null, null],
    },
    { id: '3',
      booked: [null, null, null, null, null, null],
    },
    { id: '4',
      booked: [null, null, null, null, null, null],
    },
    { id: '5',
      booked: [null, null, null, null, null, null],
    },
    { id: '6',
      booked: [null, null, null, null, null, null],
    },
    { id: '7',
      booked: [null, null, null, null, null, null],
    },
    { id: '8',
      booked: [null, null, null, null, null, null],
    },
    { id: '9',
      booked: [null, null, null, null, null, null],
    },
    { id: '10',
      booked: [null, null, null, null, null, null],
    },
    { id: '12',
      booked: [null, null, null, null, null, null],
    },
  ];
}

class Scraper {
  constructor(options) {
    if (!options) throw new Error('No options provided');

    this.estadoURL = options.estadoURL;
    this.loginURL = options.loginURL;
    this.reservaURL = options.reservaURL;
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
            salas[Math.floor(index / 6)].booked[index % 6] =
              $(element).text() === 'Reservada';

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
