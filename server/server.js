const express = require("express");
const logger = require("./app/startup/logging");
const app = express();

require("./app/startup/web-config")(app);
require("./app/startup/db-config")();

const port = process.env.PORT || 8080;
app.listen(port, () =>  logger.info(`Server is started on port ${port}`));
