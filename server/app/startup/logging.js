const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

// configure and export own logger - is preferable option
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logs/logfile.log'})
    ],
    format: winston.format.combine(
        winston.format.colorize({all: true}),
        winston.format.simple()
    ),
    handleExceptions: true,
    handleRejections: true,
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/error.log' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/error.log' })
    ]
});

module.exports = logger;

// another approach - configure default winston loader
/*module.exports = function () {
    const logLevel = process.env.NODE_ENV === 'prod' ? 'info' : 'debug';
    const fileAppender = new winston.transports.File({level: logLevel, filename: 'logs/logfile.log'});
    const consoleAppender = new winston.transports.Console({level: logLevel, colorize: true, prettyPrint: true});
    // in order to store to logs to db (aka appender in sl4j)
    /!* const mongoDbAppender = new winston.transports.MongoDB( {
        db: 'mongodb://localhost/test',
        level: 'info'
    });
*!/
    winston.add(consoleAppender);
    winston.add(fileAppender);
    // winston.add(mongoDbAppender);

    winston.exceptions.handle(
        consoleAppender,
        fileAppender
    );

    // simply not working
    // winston.handleRejections(
    /!*winston.rejections.handle(
        consoleAppender,
        fileAppender
    );*!/

    // old workaround to handle rejections (async errors)
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}*/
