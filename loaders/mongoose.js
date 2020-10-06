const mongoose = require('mongoose');
const { MONGO } = require('../config');
const logger = require('./../config/winston');
const {
    MONGOOSE_CONNECTION_STATES,
    MONGOOSE_CONNECTION_PARAMS,
} = require('../utils/constants');

const mongoConnectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    poolSize: MONGOOSE_CONNECTION_PARAMS.POOL_SIZE,
    connectTimeoutMS: MONGOOSE_CONNECTION_PARAMS.CONNECT_TIMEOUT,
    serverSelectionTimeoutMS: MONGOOSE_CONNECTION_PARAMS.SERVER_SELECTION_TIMEOUT,
};

let connectionRetryCount = 0;

const handleInitialConnection = (error) => {
    if (mongoose.connection.readyState === MONGOOSE_CONNECTION_STATES.DISCONNECTED
        && connectionRetryCount <= MONGOOSE_CONNECTION_PARAMS.RETRY_COUNT) {
        connectionRetryCount++;
        logger.info(`Mongoose initial connection retry ${connectionRetryCount}`);
        this.init();
    } else {
        logger.error(
            `Mongoose initial connection failed, retry count ${MONGOOSE_CONNECTION_PARAMS.RETRY_COUNT} exceeded`,
            { error }
        );
    }
};

mongoose.connection.on('connected', () => {
    logger.verbose('Mongoose connection open');
});

mongoose.connection.on('error', (error) => {
    logger.error('Mongoose connection error', { error });
});

mongoose.connection.on('disconnected', (error) => {
    logger.warn('Mongoose connection disconnected', { error });
});

module.exports.init = () => {
    mongoose.connect(MONGO.DB, mongoConnectionOptions)
        .catch(handleInitialConnection);
};

// TODO can be added session for transactional operations.
