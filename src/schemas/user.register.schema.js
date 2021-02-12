const joi = require('joi');

const userRegisterSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required(),
    subscription: joi.array().items(joi.string().valid('free', 'pro', 'premium')),
    token: joi.string()
});

module.exports = userRegisterSchema;