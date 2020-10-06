const mongoose = require('mongoose');
const PackageSchema = require('../schemas/package');

const Package = mongoose.model('Package', PackageSchema);

module.exports = Package;
