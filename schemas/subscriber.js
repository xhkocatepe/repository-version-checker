const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubscriberSchema = new Schema(
    {
        subscriber: {
            type: String,
            required: true,
        },
        repository: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        outdatedPackages: [{
            type: String,
        }],
    },
    { timestamps: true }
);

/**
 * Indexes
 */
SubscriberSchema.index({ repository: 1, subscriber: 1 }, { unique: true });
SubscriberSchema.index({ createdAt: 1 });

module.exports = SubscriberSchema;
