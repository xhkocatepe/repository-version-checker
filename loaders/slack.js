const slack = require('./../utils/slack');
const logger = require('./../config/winston');

module.exports = async () => {
    const { error } = await slack.verify();
    if (error) {
        logger.error('Slack bot is not ready. ', error);
    } else {
        logger.verbose('Slack bot is ready.');
    }
};
