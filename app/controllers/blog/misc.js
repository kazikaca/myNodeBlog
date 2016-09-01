var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('blog/index', {
        title: '首页',
        pretty: true
    });
});

router.get('/about', function (req, res, next) {
    res.render('blog/about', {
        title: '关于我',
        pretty: true
    });
});
