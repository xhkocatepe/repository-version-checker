const acceptLanguageParser = require('accept-language-parser');
const logger = require('../config/winston');

module.exports = () => (req, res, next) => {
    const supportedLanguages = ['tr', 'en'];
    const defaultLanguage = 'tr';
    let language = 'tr';
    if (req.headers['accept-language']) {
        try {
            language = acceptLanguageParser.pick(supportedLanguages, req.headers['accept-language']);
        } catch (e) {
            logger.error('Error occurred when parsing Accept-Language.');
        }
    }
    req.localization = language || defaultLanguage;
    next();
};
