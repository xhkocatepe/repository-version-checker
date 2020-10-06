const NodeEnvironment = require('jest-environment-node');

module.exports = class MongoEnvironment extends NodeEnvironment {
    async setup() {
        console.log('Setup MongoDB Test Environment');
        await super.setup();
    }

    async teardown() {
        console.log('Teardown MongoDB Test Environment');
        await super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }
};
