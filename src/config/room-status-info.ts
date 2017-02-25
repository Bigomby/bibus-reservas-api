import { RoomStatusInfo } from 'modules/scraper/interfaces/room-status-info.interface';

const roomStatusInfo: { [key: string]: RoomStatusInfo } = {
  // Arquitectura
  arq: {
    url: 'https://bib2.us.es/estado_salas/ARQ',
    selectors: {
      headerSelector: '#table5 > thead',
      contentSelector: '#table5 > tbody',
    },
  },

  // CRAI Antonio de Ulloa
  craiu: {
    url: 'https://bib2.us.es/estado_salas/CRAIU',
    selectors: {
      headerSelector: '#table11 > thead',
      contentSelector: '#table11 > tbody',
    },
  },

  // Informática
  bii: {
    url: 'https://bib2.us.es/estado_salas/BII',
    selectors: {
      headerSelector: '#table5 > thead',
      contentSelector: '#table5 > tbody',
    },
  },

  // Ciencias de la Educación
  bce: {
    url: 'https://bib2.us.es/estado_salas/BCE',
    selectors: {
      headerSelector: '#table1 > thead',
      contentSelector: '#table1 > tbody',
    },
  },

  // Derecho y CC. del Trabajo
  bdct: {
    url: 'https://bib2.us.es/estado_salas/BDCT',
    selectors: {
      headerSelector: '#table1 > thead',
      contentSelector: '#table1 > tbody',
    },
  },

  // Económicas
  bee: {
    url: 'https://bib2.us.es/estado_salas/BEE',
    selectors: {
      headerSelector: '#table6 > thead',
      contentSelector: '#table6 > tbody',
    },
  },

  // Filosofía y Psicología
  bpf: {
    url: 'https://bib2.us.es/estado_salas/BPF',
    selectors: {
      headerSelector: '#table1 > thead',
      contentSelector: '#table1 > tbody',
    },
  },

  // Turismo y Finanzas
  ftur: {
    url: 'http://bib2.us.es/estado_salas/FTUR',
    selectors: {
      headerSelector: '#table1 > thead',
      contentSelector: '#table1 > tbody',
    },
  },

  // Comunicación
  bc: {
    url: 'https://bib2.us.es/estado_salas/BC',
    selectors: {
      headerSelector: '#table1 > thead',
      contentSelector: '#table1 > tbody',
    },
  },

  // Ingeniería
  bia: {
    url: 'https://bibing.us.es/estado_salas/BIA',
    selectors: {
      headerSelector: '#table1 > thead',
      contentSelector: '#table1 > tbody',
    },
  },

  // Bellas Artes
  bbaa: {
    url: 'https://bib2.us.es/estado_salas/BBAA',
    selectors: {
      headerSelector: '#table1 > thead',
      contentSelector: '#table1 > tbody',
    },
  },
};

export { roomStatusInfo };
