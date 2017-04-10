var express = require('express'),
    router = express.Router(),
    PostServ = require('../../service/postService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  PostServ.getNewest5Posts(function (err, posts) {
    if (err)return next(err);

    res.render('blog/index', {
      title: '首页',
      posts: posts,
      pretty: true
    });

  });
});

router.get('/about', function (req, res, next) {
  res.render('blog/about', {
    title: '关于我',
    pretty: true
  });
});

router.get('/v1-login', function (req, res, next) {
  res.render('login', {
    pretty: true,
    title: '登录'
  });
});
