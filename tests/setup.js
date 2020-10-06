/* eslint-disable */
const MongodbMemoryServer = require('mongodb-memory-server');

const mongod = new MongodbMemoryServer.default({
    instance: {
        dbName: 'jest',
    },
    binary: {
        version: '4.0.4',
    },
    autoStart: false,
});

module.exports = async () => {
    if (!mongod.isRunning) {
        await mongod.start();
    }

    process.env.DB = await mongod.getConnectionString();
    console.log('Config is written');

    // Set reference to mongod in order to close the server during teardown.
    global.__MONGOD__ = mongod;
};
