var pinyin = require('pinyin'),
    NoteUserService = require('../service/noteUserService.js');

/**
 * 汉字转换拼音
 * @param {string} str
 * @returns {string}
 */
function chgToPinyin(str) {
    return pinyin(str, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function (item) {
        return item[0]
    }).join(' ');
}
exports.chgToPinyin = chgToPinyin;

function requireLogin(req, res, next) {
    if(req.sessionUser){
        next();
    }else{
        next(new Error("需要登录"));
    }
}
exports.requireLogin = requireLogin;

function requireUserId(req, res, next) {
    var _userId = req.get('_userId');
    if (_userId) {
        req.noteUserId = _userId;
        next();
    } else {
        return res.json({
            code: 401,
            message: '未授权'
        });
    }
}
exports.requireUserId = requireUserId;

function checkAuth(userId, callback) {
    NoteUserService.getNoteUserById(userId, function (err, user) {
        var userExist = !err && !!user;
        callback.call(this, ( userExist ? null : { code: 401, message: '未授权' }), user);
    });
}
exports.checkAuth = checkAuth;
