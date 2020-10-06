module.exports.NODE_ENVIRONMENTS = {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development',
    TEST: 'test',
};

module.exports.REPO_LANGUAGE = {
    JAVASCRIPT: 'JavaScript',
    PHP: 'PHP',
};

module.exports.MONGOOSE_CONNECTION_STATES = {
    CONNECTED: 1,
    DISCONNECTED: 0,
};

module.exports.MONGOOSE_CONNECTION_PARAMS = {
    RETRY_COUNT: 3,
    SERVER_SELECTION_TIMEOUT: 5000,
    CONNECT_TIMEOUT: 5000,
    POOL_SIZE: 20,
};
module.exports.GITHUB_API_BASE_URL = 'https://api.github.com';


module.exports.PACKAGES_INFO = () => {
    const packageInfo = { FILE_NAME: { }, DEPENDENCY_FIELD_NAME: {} };
    packageInfo.FILE_NAME[this.REPO_LANGUAGE.JAVASCRIPT] = 'package.json';
    packageInfo.FILE_NAME[this.REPO_LANGUAGE.PHP] = 'composer.json';
    packageInfo.DEPENDENCY_FIELD_NAME[this.REPO_LANGUAGE.JAVASCRIPT] = 'dependencies';
    packageInfo.DEPENDENCY_FIELD_NAME[this.REPO_LANGUAGE.PHP] = 'require';

    return packageInfo;
};

module.exports.HTTP_NOT_FOUND = 404;

module.exports.CRON_EXPR_FOR_ALL_UPDATE_PACKAGES = '*/3 * * * *'; // Every 1 minutes

module.exports.JOB_SCHEDULER_NAME_FOR_ALL_UPDATE_PACKAGES = 'allPackagesCheck';

module.exports.MOMENT_ISTANBUL_TIMEZONE = 'Europe/Istanbul';

module.exports.PACKAGE_VERSIONS_API_URL_FOR_JAVASCRIPT = 'https://api.npms.io/v2/package/mget';

module.exports.PACKAGE_VERSIONS_API_URL_FOR_PHP = 'https://libraries.io/api/packagist/';
