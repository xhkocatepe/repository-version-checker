const helper = require('./../utils/helper');
const winstonLogger = require('../config/winston');
const { NODE_ENVIRONMENTS } = require('./../utils/constants');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    const { status, result } = helper.responseFormatter(err, {}, req.localization);
    const responseData = { ...result };

    // set locals, only providing error in development
    if (process.env.NODE_ENV === NODE_ENVIRONMENTS.DEVELOPMENT) {
        responseData.err = err.toString();
    }

    // log errors
    winstonLogger.error(
        `${status || 500} - ` +
        `${req.originalUrl} - ` +
        `${req.method} - ` +
        `${result.returnCode} - ` +
        `${result.returnMessage} - ` +
        `${req.ip} - ` +
        `${err.message}`
    );

    // return result
    res.status(status || 500).send(responseData);
};

module.exports = errorHandler;
