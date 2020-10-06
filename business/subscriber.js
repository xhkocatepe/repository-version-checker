const _ = require('lodash');
const axios = require('axios').default;

const logger = require('../config/winston');
const subscriberRepo = require('../repository/subscriber');
const packageBusiness = require('./package');

const PackageFactory = require('./packageFactory/packageFactory');

const CONSTANTS = require('../utils/constants');
const { BadRequestError } = require('../utils/customError');
const { RETURN_MESSAGES, VALIDATION_MESSAGES } = require('../utils/messages');

module.exports.getDefinedRepositoryLanguage = async ({ repository }) => {
    const definedLanguages = [...PackageFactory.instances.keys()];
    let repoLanguage;

    for (const lang of definedLanguages) {
        const jsonFileName = CONSTANTS.PACKAGES_INFO().FILE_NAME[lang];
        const packageUrlPath = `repos/${repository}/contents/${jsonFileName}`;
        const packageUrl = new URL(packageUrlPath, CONSTANTS.GITHUB_API_BASE_URL);
        try {
            // eslint-disable-next-line no-await-in-loop
            const { data: { content } } = await axios.get(packageUrl.href);
            if (content) {
                repoLanguage = lang;
                return repoLanguage;
            }
        } catch (error) {
            logger.info(`missing language ${lang}`, error);
        }
    }

    if (!repoLanguage) {
        throw new BadRequestError(
            RETURN_MESSAGES.FAILED_GET_LATEST_REPOSITORY_LANGUAGES,
            RETURN_MESSAGES.FAILED_GET_LATEST_REPOSITORY_LANGUAGES.code
        );
    }

    return repoLanguage;
};

module.exports.checkRepositoryWithSubscriberAlreadyExists = async ({ repository, subscriber }) => {
    const existingRecord = await subscriberRepo.findSubscriberByByRepoAndSubscriberMail({ repository, subscriber });
    if (existingRecord) {
        throw new BadRequestError(
            VALIDATION_MESSAGES.DUPLICATE_REPO_WITH_SUBSCRIBER, RETURN_MESSAGES.ERR_VALIDATION.code
        );
    }
};

module.exports.createSubscriber = ({ repository, subscriber, outdatedPackages, language }) => {
    try {
        return subscriberRepo.create(
            { repository, subscriber, outdatedPackages: Object.keys(outdatedPackages), language }
        );
    } catch (error) {
        logger.error(RETURN_MESSAGES.NOT_CREATED_SUBSCRIBER.messages.en, error);

        throw new BadRequestError(RETURN_MESSAGES.NOT_CREATED_SUBSCRIBER, RETURN_MESSAGES.NOT_CREATED_SUBSCRIBER.code);
    }
};

module.exports.updateSubscriber = ({ repository, subscriber, outdatedPackages }) => {
    try {
        return subscriberRepo.update({ repository, subscriber }, { outdatedPackages: Object.keys(outdatedPackages) });
    } catch (error) {
        logger.error(RETURN_MESSAGES.NOT_UPDATED_SUBSCRIBER.messages.en, error);

        throw new BadRequestError(RETURN_MESSAGES.NOT_UPDATED_SUBSCRIBER, RETURN_MESSAGES.NOT_UPDATED_SUBSCRIBER.code);
    }
};

module.exports.updateSubscribesWithPackagesViaScheduler = async ({ schedulerTime }) => {
    try {
        // STEP 1
        // Find Subscribers from Subscriber Collections
        const subscribersWithRepo =
            await subscriberRepo.findSubscribersWithRepoBySchedulerTime({ schedulerTime });

        // STEP 2
        // We continue only distinct repo for the performance
        const subscribersWithDistinctRepo = _.uniqBy(subscribersWithRepo, 'repository');

        // STEP 3
        // TODO Optional! For the performance Check Repository is modified or not

        // STEP 4
        // Get current packages through Github API because repo must be added or deleted any new packages.
        const reposWithCurrentPackages = [];
        for (const subsWithRepo of subscribersWithDistinctRepo) {
            const packageInstance = PackageFactory.getInstance(
                { repository: subsWithRepo.repository, language: subsWithRepo.language }
            );
            // eslint-disable-next-line no-await-in-loop
            await packageInstance.setCurrentPackages();
            reposWithCurrentPackages.push(
                { repository: subsWithRepo.repository,
                    currentPackages: packageInstance.currentPackages,
                    language: subsWithRepo.language,
                    packageInstance }
            );
        }

        // STEP 5
        // Get all unique distinct packages. We subtract common packages between repos.
        const allPackagesDistinct = [];
        reposWithCurrentPackages.forEach((repoInfo) => {
            Object.keys(repoInfo.currentPackages).forEach((packageName) => {
                if (!allPackagesDistinct.includes(packageName)) {
                    allPackagesDistinct.push(
                        { name: packageName,
                            language: repoInfo.language,
                            version: repoInfo.currentPackages[packageName] }
                    );
                }
            });
        });

        // STEP 6
        // Check packages existing on DB
        // Ex: packageNamesDistinct = [axios,lodash] , latestPackagesFromDB = [axios] means that lodash is new!
        const definedLanguages = [...PackageFactory.instances.keys()];
        const latestPackagesFromDBObjectFormatted = {};
        let latestPackagesFromDB = [];
        for (const lang of definedLanguages) {
            const allPackagesDistinctsByLanguage = allPackagesDistinct.filter((item) => item.language === lang);
            const packageNamesDistinctByLanguage = allPackagesDistinctsByLanguage.map((item) => item.name);
            latestPackagesFromDB =
                // eslint-disable-next-line no-await-in-loop
                await packageBusiness.getPackagesByPackageNameAndLang(
                    { packageNames: packageNamesDistinctByLanguage, language: lang }
                );
            latestPackagesFromDB.forEach((item) => {
                latestPackagesFromDBObjectFormatted[item.name] = item.version;
            });
        }

        // STEP 7
        // Filtering by packages names because of existing on DB
        const currentPackagesNonExistsDB =
            allPackagesDistinct.filter((item) => !latestPackagesFromDB.some((pkg) => pkg.name === item.name));

        // STEP 8
        // Get latest packages through API
        const latestPackagesFromAPI = await packageBusiness.updatePackageVersions(
            { packages: currentPackagesNonExistsDB }
        );

        // STEP 9
        // Loop between repos, inject packages and match package versions on repo
        const outdatedPackagesWithRepo = {};
        for (const subs of reposWithCurrentPackages) {
            const { latestPackages } = latestPackagesFromAPI.find(
                (item) => item.language === subs.language
            );

            subs.packageInstance.latestPackages = Object.assign(latestPackagesFromDBObjectFormatted, latestPackages);
            subs.packageInstance.setOutdatedPackages();
            outdatedPackagesWithRepo[subs.packageInstance.repository] = subs.packageInstance.outdatedPackages;
        }

        // STEP 10
        // Loop between subscribers and return results with outdated packages.
        return subscribersWithRepo.map((subscriberDB) => ({
            outdatedPackages: outdatedPackagesWithRepo[subscriberDB.repository],
            repository: subscriberDB.repository,
            subscriber: subscriberDB.subscriber,
        }));
    } catch (error) {
        logger.error(RETURN_MESSAGES.NOT_SUCCESSFUL_SUBSCRIBER_SCHEDULER.messages.en, error);

        throw new BadRequestError(
            RETURN_MESSAGES.NOT_SUCCESSFUL_SUBSCRIBER_SCHEDULER,
            RETURN_MESSAGES.NOT_SUCCESSFUL_SUBSCRIBER_SCHEDULER.code
        );
    }
};
