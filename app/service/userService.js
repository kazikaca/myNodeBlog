var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * 根据id获取用户
 * @param id{string}
 * @param callback{function}
 *  -err
 *  -user
 */
function getUserById(id,callback) {
    User.findById(id)
        .exec(callback);
}
exports.getUserById = getUserById;

/**
 *
 * @param user{object}
 * @param callback{function}
 *  -err
 *  -user
 */
function createUser(user,callback){
    var _user = new User(user);
    _user.save(callback);
}
exports.createUser = createUser;
