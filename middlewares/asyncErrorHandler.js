const helper = require('./../utils/helper');

module.exports = (req, res, next, promise) => {
    promise
        .then((responseData) => {
            const { result } = helper.responseFormatter(false, responseData);
            if (!res.finished) {
                res.json(result);
            }
        })
        .catch((error) => {
            next(error);
        });
};
