const mailer = require('nodemailer');
const { asyncErrorCatcher } = require('./../utils/helper');
const { MAIL } = require('./../config');

let transporter;

module.exports.connectSMTPServer = async () => {
    transporter = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: MAIL.MAIL_SERVER_USERNAME,
            pass: MAIL.MAIL_SERVER_PASSWORD,
        },
    });

    return asyncErrorCatcher(transporter.verify());
};

module.exports.sendMailToDev = async (subject, text) => asyncErrorCatcher(
    transporter.sendMail({
        from: process.env.MAIL_SERVER_USERNAME,
        to: 'bayramhakankocatepe@gmail.com',
        subject,
        text,
    })
);

module.exports.sendMailToSchedulerJobs = async (subject, text) => asyncErrorCatcher(
    transporter.sendMail({
        from: process.env.MAIL_SERVER_USERNAME,
        to: 'repositoryversionchecker@gmail.com',
        subject,
        text,
    })
);
