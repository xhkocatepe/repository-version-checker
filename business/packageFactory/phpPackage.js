const axios = require('axios');
const logger = require('../../config/winston');
const config = require('../../config');

const { RETURN_MESSAGES } = require('../../utils/messages');
const CONSTANTS = require('../../utils/constants');
const { BadRequestError } = require('../../utils/customError');

const Package = require('./package');
const PackageFactory = require('./packageFactory');

const { REPO_LANGUAGE: { PHP: language } } = require('../../utils/constants');

class PHPPackage extends Package {
    constructor({ repository }) {
        super({ language, repository });
    }

    static registerToFactory() {
        PackageFactory.register({ language, classes: PHPPackage });
    }

    async getOutdatedPackages() {
        await super.setCurrentPackages();
        await this.setLatestPackages();
        super.setOutdatedPackages();

        return this.outdatedPackages;
    }

    async setLatestPackages() {
        await super.setPackageNamesToSendAPI();

        for (const packageName of this.packageNamesToSendAPI) {
            try {
                const latestPackageUrl =
                    CONSTANTS.PACKAGE_VERSIONS_API_URL_FOR_PHP + encodeURIComponent(packageName);

                const { data: { latest_release_number: latestVersion } } =
                    // eslint-disable-next-line no-await-in-loop
                    await axios.get(latestPackageUrl, { params: { api_key: config.LIBRARIES_API_KEY } });

                this.latestPackages[packageName] = latestVersion;
            } catch (error) {
                logger.error(`Failed get latest packages ${this.language}`, error);
                if (error.response.status !== 404) {
                    throw new BadRequestError(
                        RETURN_MESSAGES.FAILED_GET_LATEST_PACKAGES_PHP.messages,
                        RETURN_MESSAGES.FAILED_GET_LATEST_PACKAGES_PHP.code
                    );
                }
            }
        }
    }
}

PHPPackage.registerToFactory();

module.exports = PHPPackage;
