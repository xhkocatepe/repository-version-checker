const semver = require('semver');
const axios = require('axios').default;
const logger = require('../../config/winston');
const helper = require('../../utils/helper');

const CONSTANTS = require('../../utils/constants');
const { RETURN_MESSAGES } = require('../../utils/messages');
const { BadRequestError } = require('../../utils/customError');

const packageBusiness = require('../package');


class Package {
    constructor({ language, repository }) {
        this.language = language;
        this.repository = repository;

        this.currentPackages = {};
        this.latestPackages = {};
        this.outdatedPackages = {};
        this.packageNamesToSendAPI = [];
    }

    async setCurrentPackages() {
        // TODO Optinal check modify or not on repository all files.
        try {
            const jsonFileName = CONSTANTS.PACKAGES_INFO().FILE_NAME[this.language];
            const packageUrlPath = `repos/${this.repository}/contents/${jsonFileName}`;
            const packageUrl = new URL(packageUrlPath, CONSTANTS.GITHUB_API_BASE_URL);

            const { data: { content, encoding } } = await axios.get(packageUrl.href);
            const jsonFile = JSON.parse(Buffer.from(content, encoding).toString());

            this.currentPackages = jsonFile[CONSTANTS.PACKAGES_INFO().DEPENDENCY_FIELD_NAME[this.language]];
        } catch (error) {
            logger.error('Failed get current packages from github ', error);
            throw new BadRequestError(
                RETURN_MESSAGES.FAILED_GET_CURRENT_PACKAGES, RETURN_MESSAGES.FAILED_GET_CURRENT_PACKAGES.code
            );
        }
    }

    setLatestPackages() {

    }

    setOutdatedPackages() {
        Object.keys(helper.formatPackages(this.currentPackages)).forEach((item) => {
            try {
                if (
                    (!semver.satisfies(this.latestPackages[item], this.currentPackages[item])) &&
                    this.latestPackages[item]) {
                    this.outdatedPackages[item] = {
                        current: this.currentPackages[item], latest: this.latestPackages[item],
                    };
                }
            } catch (err) {
                logger.error(`${this.currentPackages} Error comparing latest version`);
            }
        });
    }


    getOutdatedPackages() {

    }

    async setPackageNamesToSendAPI() {
        // It runs only getting latest packages via repository.
        // else means that for now, all packages scheduler system.
        if (this.repository) {
            const latestPackagesFromDB =
                await packageBusiness.getPackagesByPackageNameAndLang(
                    { packageNames: Object.keys(this.currentPackages),
                        language: this.language }
                );

            latestPackagesFromDB.forEach((packagesInfo) => {
                this.latestPackages[packagesInfo.name] = packagesInfo.version;
            });
            // We get rid of repo packages through using github api,
            // we firstly ask our latest packages DB, if does not include then ask github for latest version
            this.packageNamesToSendAPI = Object.keys(this.currentPackages)
                .filter((item) => !(Object.keys(this.latestPackages).includes(item)));
        } else {
            this.packageNamesToSendAPI = Object.keys(this.currentPackages);
        }
    }
}

module.exports = Package;
