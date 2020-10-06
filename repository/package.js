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

    bulkUpdate({ packagesObject, language }) {
        const bulkWrite = Object.keys(packagesObject).map((packageItem) => (
            { updateOne:
                    { filter: { name: packageItem, version: packagesObject[packageItem] },
                        update: { name: packageItem, version: packagesObject[packageItem], language },
                        upsert: true } }
        ));
        return packageModel.bulkWrite(bulkWrite);
    }
}

module.exports = new Package();
