const mongoose = require('mongoose');
const { REPO_LANGUAGE } = require('../utils/constants');

const { Schema } = mongoose;

const PackageSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        version: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            enum: Object.values(REPO_LANGUAGE),
            required: true,
        },
    },
    { timestamps: true }
);

/**
 * Indexes
 */
PackageSchema.index({ name: 1, language: 1 }, { unique: true });

module.exports = PackageSchema;
