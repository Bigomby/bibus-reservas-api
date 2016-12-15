const jsdom = require('jsdom');

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
  constructor(url = 'http://bibing.us.es/estado_salas/BIA') {
    this.url = url;
  }

  get(cb) {
    jsdom.env(
      this.url, ['http://code.jquery.com/jquery.js'], (err, window) => {
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
}

module.exports = Scraper;
