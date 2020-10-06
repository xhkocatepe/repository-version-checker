class CustomError extends Error {
    constructor(message, code) {
        super();

        this.customMessage = message;

        if (this.constructor === CustomError) {
            throw new TypeError('Abstract class "CustomError" cannot be instantiated directly.');
        }

        this.name = this.constructor.name;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends CustomError {
    constructor(message, code) {
        super(message, code);

        this.httpStatus = 400;
    }
}

class AuthenticationError extends CustomError {
    constructor(message, code) {
        super(message, code);

        this.httpStatus = 401;
    }
}

class AuthorizationError extends CustomError {
    constructor(message, code) {
        super(message, code);

        this.httpStatus = 403;
    }
}

class NotFoundError extends CustomError {
    constructor(message, code) {
        super(message, code);

        this.httpStatus = 404;
    }
}

class UncaughtError extends CustomError {
    constructor(message, code) {
        super(message, code);

        this.httpStatus = 500;
    }
}

module.exports = {
    CustomError,
    BadRequestError,
    AuthenticationError,
    AuthorizationError,
    UncaughtError,
    NotFoundError,
};
