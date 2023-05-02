const logger = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    logger.handleExceptions(
        new logger.transports.Console({ colorize: true, prettyPrint: true }),
        new logger.transports.File({ filename: 'error.log' })
    );

    // old workaround to handle rejections (async errors)
   /* process.on('unhandledRejection', (ex) => {
        throw ex;
    });*/
    logger.handleRejections(
        new logger.transports.Console({ colorize: true, prettyPrint: true }),
        new logger.transports.File({ filename: 'error.log' })
    );

    logger.add(logger.transports.File, { filename: 'logfile.log' });
    logger.add(logger.transports.Console({level: 'debug'}))

 /*   new (winston.transports.Console)({ level: 'error' }),
     new (winston.transports.File)({ filename: 'somefile.log' })*/

    // in order to store to logs to db (aka appender in sl4j)
  /*  winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost/vidly',
        level: 'info'
    });*/
}

// TODO: seems it's required to define loggeer with transports and export from here
