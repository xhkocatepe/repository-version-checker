module.exports = {
    LIBRARIES_API_KEY: process.env.LIBRARIES_API_KEY,
    MONGO: {
        DB: process.env.DB,
    },
    MAIL: {
        MAIL_SERVER_USERNAME: process.env.MAIL_SERVER_USERNAME,
        MAIL_SERVER_PASSWORD: process.env.MAIL_SERVER_PASSWORD,
    },
    CRON_EXPR_FOR_ALL_UPDATE_PACKAGES: process.env.CRON_EXPR_FOR_ALL_UPDATE_PACKAGES,
};
