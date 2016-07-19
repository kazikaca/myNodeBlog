var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('blog/test', {
        title: '测试页面',
        pretty: true
    });
});

router.get('/about', function (req, res, next) {
    res.render('blog/about', {
        title: '关于我',
        pretty: true
    });
});

router.get('/contact', function (req, res, next) {
    res.render('blog/contact', {
        title: '联系我',
        pretty: true
    });
});
