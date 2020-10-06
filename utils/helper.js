const { CustomError } = require('./customError');
const { ERR_UNDEFINED } = require('./messages').RETURN_MESSAGES;

module.exports.responseFormatter = (err, responseData, lang = 'tr') => {
    let status = 200;

    const result = {
        returnCode: 0,
        data: responseData,
    };

    if (err) {
        if (err instanceof CustomError) {
            status = err.httpStatus;
            result.returnCode = err.code;
            result.returnMessage = err.customMessage[lang];
        } else if (err.name === 'MongoError') {
            status = 400;
            result.returnCode = -9999;
            result.returnMessage = ERR_UNDEFINED.messages[lang];
        } else {
            status = 500;
            result.returnCode = -9999;
            result.returnMessage = ERR_UNDEFINED.messages[lang];
        }
    }

    return { status, result };
};

module.exports.asyncErrorCatcher = async (promise) => {
    let result;
    let error;
    try {
        result = await promise;
    } catch (e) {
        error = e;
    }
    return { error, result };
};

module.exports.formatPackages = (packages) => {
    const formattedPackages = {};
    Object.keys(packages).forEach((packageName) => {
        formattedPackages[packageName] = '';
        packages[packageName].split('').forEach((char, index, array) => {
            formattedPackages[packageName] = formattedPackages[packageName].concat(char);
            if ((char === '|') &&
                !((array[index + 1] === ' ' && array[index + 2] === '|') ||
                    (array[index + 1] === '|') ||
                    (array[index - 1] === ' ' && array[index - 2] === '|') ||
                    (array[index - 1] === '|'))) {
                formattedPackages[packageName] = formattedPackages[packageName].concat(char);
            }
        });
    });

    return formattedPackages;
};
