const RedisServer = require('redis-server');

const logger = require('./../config/winston');


// Simply pass the port that you want a Redis server to listen on.
const server = new RedisServer(6379);


module.exports = async () => {
    try {
        await server.open();
        logger.verbose('Redis Server is ready.');
    } catch (error) {
        logger.error('Redis Server is not ready. ', error);
    }
};
