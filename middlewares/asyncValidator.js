const { validationResult } = require('express-validator/check');
const { BadRequestError } = require('../utils/customError');
const { ERR_VALIDATION } = require('./../utils/messages').RETURN_MESSAGES;

module.exports = () => (req, res, next) => {
    try {
        validationResult(req).throw();
        next();
    } catch (err) {
        const errors = err.array();
        const errorMessage = errors[0].msg;
        let message = ERR_VALIDATION.messages;

        if (errorMessage && errorMessage.tr && errorMessage.en) {
            message = errorMessage;
        }

        next(new BadRequestError(message, ERR_VALIDATION.code));
    }
};
