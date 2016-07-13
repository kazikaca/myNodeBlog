var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * 根据id获取用户
 * @param id
 * @param callback
 *  -err
 *  -user
 */
function getUserById(id,callback) {
    User.findById(id)
        .exec(callback);
}
exports.getUserById = getUserById;
