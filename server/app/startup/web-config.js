const express = require("express");
const morgan = require("morgan")
const config = require("config")
const cors = require("cors");
const logger = require("winston");

const healthCheckRoute = require("../routes/healh-check-routes");
const weatherRoute = require("../routes/weather-routes");
const errorHandler = require("../middleware/request-error-handler");

module.exports = function (app) {
    logger.debug("Init routes and web related stuff");
    logger.debug(`CORS origin = ${config.get("cors.origin")}`);
    const corsOptions = {
        origin: `${(config.get("cors.origin"))}`
    };
    app.use(express.json())
    app.use(cors(corsOptions));
    app.use(morgan('tiny'));
    app.use('/health', healthCheckRoute);
    app.use('/weather', weatherRoute);
    app.use(errorHandler);
}
