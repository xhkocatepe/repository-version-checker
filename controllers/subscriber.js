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

    /**
     * TODO
     *  -------------Olusturulmadan once -------------
     *  Step 0: Ilk kayit olurken eger sistemin saatine bakilacak, Or: 15:50 ve Repo: 'R1'
     *  Step 1: Sistem de aktif processlere bakilacak, eger 15:50 yoksa direkt createJob.
     *  Step 2: Aktif processlerden 15:50 varsa, her halukarda olusturulmayacak. Yani JobName: HH:mm
     * */
    kue.subscriberSchedulerJob();

    res.render('index', { outdatedPackages, error: null });
};

module.exports.get = async (req, res) => res.render('index', { outdatedPackages: null, error: null });
