const mongoose = require('mongoose');
const SubscriberSchema = require('../schemas/subscriber');

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

module.exports = Subscriber;
