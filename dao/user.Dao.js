const userModel = require('../src/users/user.model');

module.exports.getById = (id) => {
    return userModel.findById(id);
}