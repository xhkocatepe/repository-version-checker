const axios = require('axios').default;
const _ = require('lodash');
const logger = require('../../config/winston');

const { RETURN_MESSAGES } = require('../../utils/messages');
const CONSTANTS = require('../../utils/constants');
const { BadRequestError } = require('../../utils/customError');

const Package = require('./package');
const PackageFactory = require('./packageFactory');

const { REPO_LANGUAGE: { JAVASCRIPT: language } } = require('../../utils/constants');

class JavaScriptPackage extends Package {
    constructor({ repository }) {
        super({ language, repository });
    }

    static registerToFactory() {
        PackageFactory.register({ language, classes: JavaScriptPackage });
    }

    async getOutdatedPackages() {
        await super.setCurrentPackages();
        await this.setLatestPackages();
        super.setOutdatedPackages();

        return this.outdatedPackages;
    }

    async setLatestPackages() {
        await super.setPackageNamesToSendAPI();

        const latestPackageUrl = CONSTANTS.PACKAGE_VERSIONS_API_URL_FOR_JAVASCRIPT;
        if (this.packageNamesToSendAPI.length) {
            try {
                const { data } = await axios.post(latestPackageUrl, this.packageNamesToSendAPI);
                Object.keys(data).forEach((pkgName) => {
                    data[pkgName] = _.get(data[pkgName], ['collected', 'metadata', 'version']);
                });

                Object.assign(this.latestPackages, data);
            } catch (error) {
                logger.error(`Failed get latest packages ${this.language}`, error);
                throw new BadRequestError(
                    RETURN_MESSAGES.FAILED_GET_LATEST_PACKAGES_JAVASCRIPT.messages,
                    RETURN_MESSAGES.FAILED_GET_LATEST_PACKAGES_JAVASCRIPT.code
                );
            }
        }
    }
}

JavaScriptPackage.registerToFactory();

module.exports = JavaScriptPackage;
