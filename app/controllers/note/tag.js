var express = require('express'),
    router = express.Router(),
    tool = require('../../common/tool'),
    ENUMS = require('../../common/enums'),
    TagService = require('../../service/tagService');

module.exports = function (app) {
    app.use('/noteApi/tags', router);
};

router.post('/add', tool.requireUserId,  function (req, res, next) {
    var _userId = req.noteUserId;
    tool.checkAuth(_userId, function (err, user) {
        if (err || user.type !== ENUMS.NOTE_USER.ADMIN) {
            return res.json({
                code: 401,
                message: '未授权'
            });
        }

        var name = req.body.name;

        //表单验证
        req.checkBody('name', '请输入标签名称').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            return res.json({
                code: 400,
                message: '参数有误',
                formInvalids: errors
            });
        }

        TagService.findOneTag({name: name, owner: _userId}, function (err, tag) {

            if(err){
                console.log('/noteApi/tags/add error:', err);
                res.json({
                    code: 500,
                    message: '系统内部错误'
                });
            }

            if(!!tag){
                res.json({
                    code: 409,
                    message: '该标签已存在'
                });
            } else {
                var newTag = {
                    name: name,
                    owner: _userId,
                    created: new Date()
                };

                TagService.createTag(newTag, function (err, tag) {
                    if(err){
                        console.log('/noteApi/tags/add error:', err);
                        res.json({
                            code: 500,
                            message: '系统内部错误'
                        });
                    }else{
                        res.json({
                            code: 200,
                            message: '访问成功',
                            object: tag
                        });
                    }
                })
            }

        });
    })
});

router.get('/list', tool.requireUserId, function (req, res, next) {

    var _userId = req.get('_userId');

    tool.checkAuth(_userId, function (err, user) {
        if (err) {
            return res.json(err);
        }

        TagService.findTags({owner: _userId}, function (err, tags) {

            if (err) {
                res.json({
                    code: 500,
                    message: '系统内部错误'
                });
            } else {
                res.json({
                    code: 200,
                    message: '访问成功',
                    list: tags
                });
            }
        });

    });
});
