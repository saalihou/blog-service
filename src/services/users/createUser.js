const omit = require('lodash/omit');

const User = require('../../dao/User');

module.exports = async function createUser(userPojo) {
    const user = new User(userPojo);
    await user.save();
    return omit(user.toJSON(), 'password');
}
