const express = require('express');

const repositoryController = require('../controllers/subscriber');
const repositoryValidation = require('../validations/subscriber');
const asyncErrorHandlerMiddleware = require('../middlewares/asyncErrorHandler');
const asyncValidator = require('../middlewares/asyncValidator');

const router = express.Router();

router
    .route('/')
    .post(
        repositoryValidation.create(),
        asyncValidator(),
        async (req, res, next) => {
            asyncErrorHandlerMiddleware(req, res, next, repositoryController.create({ res, req: req.body }));
        },
    );

router
    .route('/')
    .get(
        async (req, res, next) => {
            asyncErrorHandlerMiddleware(req, res, next, repositoryController.get(req, res));
        },
    );


module.exports = router;
