const kue = require('kue-scheduler');

const nodemailer = require('../utils/mailer');
const logger = require('../config/winston');
const CONSTANTS = require('../utils/constants');

const packageBusiness = require('./../business/package');
const subscriberBusiness = require('./../business/subscriber');

const Queue = kue.createQueue();

Queue.on('already scheduled', (job) => {
    logger.info(`job already scheduled${job.id}`);
});

module.exports.getLatestAndUpdatePackages = ({ jobName }) => {
    Queue.process(jobName, async (job, done) => {
        logger.verbose(`getLatestAndUpdatePackages ${new Date()}`);
        const result = await packageBusiness.updatePackageVersionsViaScheduler();

        await nodemailer.sendMailToDev('Successfuly Updated Latest Version All Packages', JSON.stringify(result));
        done();
    });
};

module.exports.subscriberSchedulerJobWorker = ({ jobName }) => {
    Queue.process(jobName, async (job, done) => {
        logger.verbose(`subscriberSchedulerJobWorker ${new Date()}`);
        const result = await subscriberBusiness.updateSubscribesWithPackagesViaScheduler({ schedulerTime: jobName });

        const promises = [];
        result.forEach((item) => {
            promises.push(nodemailer.sendMailToSchedulerJobs(item.subject, item.outdatedPackages, item.subscriber));
        });

        await Promise.all(promises);
        done();
    });
};
