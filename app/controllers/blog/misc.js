var express = require('express'),
    router = express.Router(),
    trimHtml = require('trim-html'),
    PostServ = require('../../service/postService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  PostServ.getNewest5Posts(function (err, posts) {
    if (err)return next(err);

    posts.forEach(function (post, index) {
      var content = trimHtml(post.content, {limit: index === 0 ? 700 : 160});
      post.content = content.html;
    });

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
