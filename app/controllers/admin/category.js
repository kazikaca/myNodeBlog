var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    CategoryServ = require('../../service/categoryService');

module.exports = function (app) {
    app.use('/admin/categories', router);
};

router.get('/', function (req, res, next) {
    CategoryServ.getAllCategory(function (err, categories) {
        if(err)return next(err);
        res.render('admin/category/index', {
            categories:categories,
            pretty: true
        });
    });

});

router.get('/add', function (req, res, next) {
    res.render('admin/category/add', {
        pretty: true
    });
});

router.post('/add', function (req, res, next) {
});

router.get('/edit/:id', function (req, res, next) {
});

router.post('/edit/:id', function (req, res, next) {
});

router.get('/delete/:id', function (req, res, next) {
});

