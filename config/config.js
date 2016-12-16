const joi = require('joi');

const envVarsSchema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  PORT: joi.number()
    .default(8080),
  LOGGER_LEVEL: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
  SCRAPER_URL: joi.string()
    .default('http://bibing.us.es/estado_salas/BIA'),
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
  server: {
    port: envVars.PORT,
  },
  scraper: {
    url: envVars.SCRAPER_URL,
  },
};

module.exports = config;
