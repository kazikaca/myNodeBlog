var mongoose = require('mongoose'),
    NoteUser = mongoose.model('NoteUser');

/**
 * 根据id获取用户
 * @param id{string}
 * @param callback{function}
 *  -err
 *  -user
 */
function getNoteUserById(id, callback) {
    NoteUser.findById(id)
        .exec(callback);
}
exports.getNoteUserById = getNoteUserById;

/**
 * 获取到第一个匹配的用户
 * @param conditions
 * @param callback
 */
function findOneUser(conditions, callback) {
    NoteUser.findOne(conditions)
        .exec(callback);
}
exports.findOneUser = findOneUser;

/**
 *
 * @param noteuser{object}
 * @param callback{function}
 *  -err
 *  -user
 */
function createUser(noteuser,callback){
    var _user = new NoteUser(noteuser);
    _user.save(callback);
}
exports.createUser = createUser;
