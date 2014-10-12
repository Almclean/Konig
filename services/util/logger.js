/**
 * Created by Ivan O'Mahony on 9/10/2014.
 */
var winston = require('winston');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
// TODO Enable later to log to file
//        new winston.transports.File({
//            level: 'info',
//            filename: './logs/all-logs.log',
//            handleExceptions: true,
//            json: true,
//            maxsize: 5242880, //5MB
//            maxFiles: 5,
//            colorize: false
//        }),
        new winston.transports.Console({
            colorize: true,
            timestamp: true,
            level: 'debug'
        })
    ],
    exitOnError: false
});

module.exports = logger;

module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};
