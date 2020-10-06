const subscriberModel = require('../models/subscriber');
const CONSTANTS = require('../utils/constants');

class Repository {
    async findSubscriberByByRepoAndSubscriberMail({ repository, subscriber }) {
        let result;
        if (subscriber && repository) {
            result = await subscriberModel.findOne({ repository, subscriber });
        }
        return result;
    }

    create(data) {
        return subscriberModel.create(data);
    }

    update({ repository, subscriber }, { outdatedPackages }) {
        return subscriberModel.update({ repository, subscriber }, { outdatedPackages });
    }

    findSubscribersWithRepoBySchedulerTime({ schedulerTime }) {
        return subscriberModel.aggregate(
            [
                {
                    $addFields: {
                        timewithOffsetIstanbul: {
                            $dateToString: {
                                format: '%H:%M',
                                date: '$createdAt',
                                timezone: CONSTANTS.MOMENT_ISTANBUL_TIMEZONE,
                            },
                        },
                    },
                },
                {
                    $match: {
                        timewithOffsetIstanbul: schedulerTime,
                    },
                },
            ]
        );
    }
}

module.exports = new Repository();
