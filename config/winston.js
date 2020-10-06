const winston = require('winston');

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            maxFiles: 2,
            maxsize: 20000,
            tailable: true,
        }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize({ all: true }),
            winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        level: 'verbose',
    })
);

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write(message) {
        logger.info(message);
    },
};

module.exports = logger;
