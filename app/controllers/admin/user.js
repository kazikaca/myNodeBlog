var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    md5 = require('md5'),
    passport = require('passport'),
    User = mongoose.model('User');

module.exports = function (app) {
    app.use('/admin/users', router);
};

router.get('/login', function (req, res, next) {
    res.render('login', {
        pretty: true,
        title: '登录'
    });
});

router.post('/login',
    passport.authenticate('local', {failureRedirect: '/admin/users/login'}),
    function (req, res, next) {
        res.redirect('/admin/posts');
    }
);

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/admin/users/login');
});
