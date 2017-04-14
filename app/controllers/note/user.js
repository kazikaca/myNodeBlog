var express = require('express'),
    router = express.Router(),
    md5 = require('md5'),
    tool = require('../../common/tool'),
    NoteUserService = require('../../service/noteUserService');

module.exports = function (app) {
    app.use('/noteApi/users', router);
};

router.post('/add', tool.requireUserId, function (req, res, next) {
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

    // 检查AK是否已经被占用
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
                type: type && type.toLowerCase(),
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
        } else if (!user) {
            res.json({
                code: 401,
                message: '未授权'
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
