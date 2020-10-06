const packageModel = require('../models/package');

class Package {
    findAll() {
        return packageModel.find().lean();
    }

    create(packages) {
        return packageModel.create(packages);
    }

    findByPackageNameAndLanguage({ packageNames, language }) {
        return packageModel.find({ name: packageNames, language }).lean();
    }

    // eslint-disable-next-line class-methods-use-this
    async bulkUpdate({ packagesObject, language }) {
        let result;
        const bulkWrite = Object.keys(packagesObject).map((packageItem) => (
            { updateOne:
                    { filter: { name: packageItem, version: packagesObject[packageItem] },
                        update: { name: packageItem, version: packagesObject[packageItem], language },
                        upsert: true } }
        ));

        if (bulkWrite.length) {
            result = await packageModel.bulkWrite(bulkWrite);
        }

        return result;
    }
}

module.exports = new Package();
