const Slack = require('slack');
const { asyncErrorCatcher } = require('./helper');

const CHANNEL_NAME = 'monitor';
const BOT_NAME = 'Microservice Boilerplate';
const BOT_ICON = ':ghost:';
const configuration = { channel: CHANNEL_NAME, username: BOT_NAME, icon_emoji: BOT_ICON };
let bot;

module.exports.verify = async () => {
    bot = Slack({ token: process.env.SLACK_BOT_TOKEN });
    return asyncErrorCatcher(bot.auth.test());
};

module.exports.sendMessage = (message) => {
    bot.chat.postMessage({ text: message, ...configuration });
};
