var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    md5 = require('md5'),
    passport = require('passport'),
    tool = require('../../common/tool'),
    NoteUserService = require('../../service/noteUserService.js');

module.exports = function (app) {
    app.use('/noteApi/users', router);
};

router.post('/add', function (req, res, next) {
    var ak = req.body.ak,
        confirmAk = req.body.confirmAk,
        type = req.body.type;

    //表单验证
    req.checkBody('ak', '请输入APP key').notEmpty();
    req.checkBody('type', '请选择类型').notEmpty();
    req.checkBody('confirmAk', '请确认APP key').notEmpty();
    req.checkBody('confirmAk', '两次APP key不匹配').equals(ak);

    var errors = req.validationErrors();
    if (errors) {
        return res.json({
            code: 400,
            message: '参数有误',
            formInvalids: errors
        });
    }

    var md5AK = md5(ak);

    NoteUserService.findOneUser({ak: md5AK}, function(err, user){
        if(err){
            console.log('/noteApi/users/add error:', err);
            res.json({
                code: 500,
                message: '系统内部错误'
            });
        }
        if(!!user){
            res.json({
                code: 409,
                message: '该AK已经被占用'
            });
        } else {

            var newUser = {
                ak: md5AK,
                type: type,
                created: new Date()
            };

            NoteUserService.createUser(newUser,function(err){
                if(err){
                    console.log('/noteApi/users/add error:', err);
                    res.json({
                        code: 500,
                        message: '系统内部错误'
                    });
                }else{
                    res.json({
                        code: 200,
                        message: '访问成功'
                    });
                }
            });
        }
    });
});

router.post('/login', tool.requireUserId, function (req, res, next) {
    var ak = req.body.ak;

    //表单验证
    req.checkBody('ak', '请输入APP key').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.json({
            code: 400,
            message: '参数有误',
            formInvalids: errors
        });
    }

    var md5AK = md5(ak);

    NoteUserService.findOneUser({ak: md5AK}, function(err, user){
        if (err) {
            console.log('/noteApi/users/login error:', err);
            res.json({
                code: 500,
                message: '系统内部错误'
            });
        } else {
            user.ak = null;
            res.json({
                code: 200,
                message: '访问成功',
                user: user
            });
        }
    });

});


function getById(req, res, next) {
    //user id 从params传进或者从session中获取
    var _userId = req.params.id || req.body.id;

    if (!_userId) {
        return next(new Error('no user id provided'));
    }

    UserServ.getUserById(_userId, function (err, user) {
        if (err)return next(err);
        if (!user)return next(new Error('user not found'));

        req.user = user;
        next();
    });
}
