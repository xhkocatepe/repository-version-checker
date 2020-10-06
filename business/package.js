const _ = require('lodash');

const logger = require('../config/winston');
const packageRepo = require('../repository/package');

const PackageFactory = require('./packageFactory/packageFactory');

const { BadRequestError } = require('../utils/customError');
const { RETURN_MESSAGES } = require('../utils/messages');

module.exports.createLatestPackages = async ({ packageInstance, language }) => {
    const packagesObject = packageInstance.latestPackages;
    const newPackageNamesNonExistsdB = packageInstance.packageNamesToSendAPI;

    const packagesForRepo = newPackageNamesNonExistsdB.map((packageName) => (
        { name: packageName, version: packagesObject[packageName], language }
    ));

    try {
        await packageRepo.create(packagesForRepo);
    } catch (error) {
        logger.error(RETURN_MESSAGES.NOT_CREATED_PACKAGES.messages.en, error);

        throw new BadRequestError(RETURN_MESSAGES.NOT_CREATED_PACKAGES, RETURN_MESSAGES.NOT_CREATED_PACKAGES.code);
    }
};

module.exports.getAllPackages = () => packageRepo.findAll();

module.exports.getPackagesByPackageNameAndLang =
    ({ packageNames, language }) => packageRepo.findByPackageNameAndLanguage({ packageNames, language });

module.exports.updatePackageVersionsViaScheduler = async () => {
    const allPackages = await this.getAllPackages();
    return this.updatePackageVersions({ packages: allPackages });
};

module.exports.updatePackageVersions = async ({ packages }) => {
    const definedLanguages = [...PackageFactory.instances.keys()];

    const result = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const language of definedLanguages) {
        const packagesFiltered = packages.filter((packageItem) => packageItem.language === language);

        const packageObjectFormatted = {};
        packagesFiltered.forEach(((packageItem) => {
            packageObjectFormatted[packageItem.name] = packageItem.version;
        }));

        const packageInstance = PackageFactory.getInstance({ language });
        packageInstance.currentPackages = packageObjectFormatted;
        // eslint-disable-next-line no-await-in-loop
        await packageInstance.setLatestPackages();
        packageInstance.setOutdatedPackages();

        try {
            result.push(
                {
                    // eslint-disable-next-line no-await-in-loop
                    bulkUpdateResult: await packageRepo.bulkUpdate(
                        { packagesObject: packageInstance.latestPackages, language }
                    ),
                    latestPackages: packageInstance.latestPackages,
                    language,
                },

            );
        } catch (error) {
            logger.error(`Error Bulk Updateing this ${language}`);
        }
    }

    return result;
};
