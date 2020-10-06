const instances = new Map();

class PackageFactory {
    static register({ language, classes }) {
        instances.set(language, classes);
    }

    static getInstance({ language, repository }) {
        const Class = instances.get(language);

        return new Class({ repository }) || null;
    }
}

module.exports = PackageFactory;

module.exports.instances = instances;
