const fs = require('fs');
const _ = require('lodash');
const pluralize = require('pluralize');

const routesDir = `${process.cwd()}/routes`;

module.exports = (app) => {
    fs.readdirSync(routesDir).forEach((fileName) => {
        const ignoreRoutes = ['index', 'readme'];
        const routerName = fileName
            .split('.')
            .shift()
            .toLowerCase();
        if (_.includes(ignoreRoutes, routerName)) {
            return;
        }
        console.log('--', `${routesDir}/${routerName}`);
        app.use(`/${pluralize.plural(routerName)}`, require(`${routesDir}/${routerName}`));
    });
};
