const joi = require('joi');

module.exports = contactValidator = async (res, data, schema) => {
    try {
        const { value, error } = await schema.validate(data);
        // error && console.log('errorValidate: ', error.details.map(el => el.message)[0]);
        if (error) {
            return error.details.map(el => el.message)[0];
        }
    }
    catch (err) {
        console.log(err);
    }
}