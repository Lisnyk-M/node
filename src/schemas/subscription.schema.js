const joi = require('joi');

const subscriptionSchema = joi.object({
    subscription: joi.string().valid('free', 'pro', 'premium')
});

module.exports = subscriptionSchema;