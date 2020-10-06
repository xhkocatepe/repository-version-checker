const kue = require('../scheduler/kue');
const subscriberBusiness = require('./../business/subscriber');
const packageBusiness = require('./../business/package');
const PackageFactory = require('../business/packageFactory/packageFactory');

module.exports.create = async ({ res, req: { repository, subscriber } }) => {
    await subscriberBusiness.checkRepositoryWithSubscriberAlreadyExists({ repository, subscriber });

    const language = await subscriberBusiness.getDefinedRepositoryLanguage({ repository });

    const packageInstance = PackageFactory.getInstance({ language, repository });
    const outdatedPackages = await packageInstance.getOutdatedPackages();

    await subscriberBusiness.createSubscriber(
        { repository, subscriber, outdatedPackages, language: packageInstance.language }
    );
    await packageBusiness.createLatestPackages({ packageInstance, language: packageInstance.language });

    kue.subscriberSchedulerJob();

    res.render('index', { outdatedPackages, error: null });
};

module.exports.get = async (req, res) => res.render('index', { outdatedPackages: null, error: null });
