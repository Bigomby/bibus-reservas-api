import * as SwaggerExpress from "swagger-express-mw";
import * as express from "express";
import config from "../config/config";

const app = express();

SwaggerExpress.create(config.api, (err, swaggerExpress) => {
  if (err) throw err;

  swaggerExpress.register(app);
  app.listen(config.api.port, () => {
    console.log("Escuchando en puerto", config.api.port);
  });
});

export default app;
