const mailer = require('../utils/mailer');
const logger = require('./../config/winston');

module.exports = async () => {
    const { error } = await mailer.connectSMTPServer();
    if (error) {
        logger.error('Mail server is not ready. ', error);
    } else {
        logger.verbose('Mail server is ready.');
    }
};
