const { body } = require('express-validator/check');
const { VALIDATION_MESSAGES } = require('./../utils/messages');
// const subscriberRepo = require('../repository/subscriber');

module.exports.create = () => [
    body('repository')
        .exists()
        .withMessage(VALIDATION_MESSAGES.MISSING_FIELDS),
    body('subscriber')
        .exists()
        .withMessage(VALIDATION_MESSAGES.MISSING_FIELDS)
        .isEmail()
        .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT),
    // body()
    //     .custom(async (value, { req }) => {
    //         const existingRecord = await subscriberRepo.findSubscriberByByRepoAndSubscriberMail(
    //             { repository: req.body.repository, subscriber: req.body.subscriber }
    //         );
    //
    //         return !existingRecord;
    //     })
    //     .withMessage(VALIDATION_MESSAGES.DUPLICATE_REPO_WITH_SUBSCRIBER),
];
