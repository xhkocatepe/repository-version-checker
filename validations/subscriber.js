const { body } = require('express-validator/check');
const { VALIDATION_MESSAGES } = require('./../utils/messages');

module.exports.create = () => [
    body('repository')
        .exists()
        .withMessage(VALIDATION_MESSAGES.MISSING_FIELDS),
    body('subscriber')
        .exists()
        .withMessage(VALIDATION_MESSAGES.MISSING_FIELDS)
        .isEmail()
        .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT),
];
