const kue = require('kue-scheduler');
const moment = require('moment-timezone');
const worker = require('./worker');
const logger = require('../config/winston');

const CONSTANTS = require('../utils/constants');

const Queue = kue.createQueue();

module.exports.getLatestAndUpdatePackages = () => {
    const jobName = CONSTANTS.JOB_SCHEDULER_NAME_FOR_ALL_UPDATE_PACKAGES;
    const job = Queue
        .createJob(jobName, { timezone: CONSTANTS.MOMENT_ISTANBUL_TIMEZONE })
        .attempts(3);

    Queue.every(CONSTANTS.CRON_EXPR_FOR_ALL_UPDATE_PACKAGES, job);

    worker.getLatestAndUpdatePackages({ jobName });
};

module.exports.subscriberSchedulerJob = () => {
    const jobName = moment().tz(CONSTANTS.MOMENT_ISTANBUL_TIMEZONE).format('HH:mm');
    logger.verbose(`Job Name declerad! ${jobName}`);

    const job = Queue
        .createJob(jobName, { timezone: CONSTANTS.MOMENT_ISTANBUL_TIMEZONE })
        .backoff({
            delay: 3000,
        })
        .attempts(3)
        // prevent from a new job same jobName!
        .unique(jobName);

    const [hour, min] = jobName.split(':');
    Queue.every(`${min} ${hour} * * *`, job);

    worker.subscriberSchedulerJobWorker({ jobName: jobInfo.jobName });
};
