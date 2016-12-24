[![](https://img.shields.io/badge/api-documentation-blue.svg)](https://bigomby.github.io/bibing-salas-api/docs/)

# bibing-salas-api

API RESTful para acceder a la aplicación de reserva de salas de la Biblioteca
de la Escuela Técnica Superior de Ingenieros de la Universidad de Sevilla.

## Uso

### Usando Node.JS

```bash
git clone https://github.com/Bigomby/bibing-salas-api.git
cd bibing-salas-api
npm install
```

Para ejecutar la aplicación:

```bash
npm start
```

### Usando Docker

```bash
docker run -p 8080:8080 bigomby/bibing-salas-api
```

## Configuración

- `NODE_ENV` [**'development'**, 'production', 'test']: Entorno de ejecución.
- `PORT` [**8080**]: Puerto para la escucha del servidor.
- `LOG_LEVEL` ['error', 'warn', **'info'**, 'verbose', 'debug', 'silly']: Nivel de
depuración.
- `SCRAPER_ESTADO_URL` ['https://bibing.us.es/estado_salas/BIA']: URL para
consultar las salas.
- `SCRAPER_RESERVA_URL` ['https://bibing.us.es/reserva_salas/BIA']: URL para
realizar las reservas.
- `SCRAPER_LOGIN_URL`
['https://sso.us.es/CAS/index.php/login?service=https%3A%2F%2Fbibing.us.es%2Freserva_salas%2FBIA']:
URL para realizar el login.
