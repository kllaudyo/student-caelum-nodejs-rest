var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: '../logs/payfast.log',
            maxsize: 100,
            maxFiles:10
        })
    ]
});

logger.log('log utilizando o winston');
logger.log('info', 'Log utilizando winston e info');