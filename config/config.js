const joi = require('joi');

const envVarsSchema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  PORT: joi.number()
    .default(8080),
  LOG_LEVEL: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
  SCRAPER_ESTADO_URL: joi.string()
    .default('https://bibing.us.es/estado_salas/BIA'),
  SCRAPER_RESERVA_URL: joi.string()
    .default('https://bibing.us.es/reserva_salas/BIA'),
  SCRAPER_LOGIN_URL: joi.string()
    .default('https://sso.us.es/CAS/index.php/login?service=https%3A%2F%2Fbibing.us.es%2Freserva_salas%2FBIA'),
  API_ROOT: joi.string()
    .default('https://bigomby.github.io/bibing-salas-api/'),
}).unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  logger: {
    level: envVars.LOG_LEVEL,
  },
  api: {
    port: envVars.PORT,
    appRoot: '.',
  },
  scraper: {
    estadoURL: envVars.SCRAPER_ESTADO_URL,
    loginURL: envVars.SCRAPER_LOGIN_URL,
    reservaURL: envVars.SCRAPER_RESERVA_URL,
  },
};

module.exports = config;
