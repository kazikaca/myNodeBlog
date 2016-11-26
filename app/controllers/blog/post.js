var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category'),
    PostServ = require('../../service/postService');

module.exports = function (app) {
  app.use('/posts', router);
};

router.get('/', function (req, res, next) {

  PostServ.countPosts(function (err, count) {
    if (err) return next(err);

    var total = count;
    var page = Math.abs(parseInt(req.query.page || 1, 10));
    var size = 10;

    if(page * size > total){
      res.redirect('/posts?page=1');
      return;
    }

    var totalpages = Math.ceil(total / size);
    var step2skip = (page - 1) * size;

    PostServ.getPostsWithQuery(
        {published: true},
        {'created':'desc'},
        ['author', 'category'],
        step2skip,
        size,
        function (err, posts) {
          if (err) return next(err);

          res.render('blog/posts', {
            title: '所有文章',
            posts: posts,
            pageNum: page,
            pageCount: totalpages,
            pretty: true
          });
        });
  });
});

router.get('/category/:name', function (req, res, next) {
  Category.findOne({name: req.params.name}).exec(function (err, category) {
    if (err) {
      return next(err);
    }

    Post.find({category: category, published: true})
        .sort('-created')
        .populate('category')
        .populate('author')
        .exec(function (err, posts) {
          if (err) {
            return next(err);
          }

          res.render('blog/category', {
            title: category.name + '分类下的文章',
            posts: posts,
            category: category,
            pretty: true
          });

        });
  });
});

router.get('/view/:id', function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('no post id provided'));
  }

  var conditions = {};
  try {
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    conditions.slug = req.params.id;
  }

  Post.findOne(conditions)
      .populate('category')
      .populate('author')
      .exec(function (err, post) {
        if (err) {
          return next(err);
        }

        if (!post) {
          return next(new Error('no such post'));
        }

        res.render('blog/view', {
          title: post.title,
          post: post
        });
      });
});

router.get('/favorite/:id', function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('no post id provided'));
  }

  var conditions = {};
  try {
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    conditions.slug = req.params.id;
  }

  Post.findOne(conditions)
      .populate('category')
      .populate('author')
      .exec(function (err, post) {
        if (err) {
          return next(err);
        }

        post.meta.favorite = post.meta.favorite ? post.meta.favorite + 1 : 1;
        post.markModified('meta');
        post.save(function (err) {
          res.redirect('/posts/view/' + post.slug);
        });
      });
});

router.post('/comment/:id', function (req, res, next) {
  if (!req.body.email) {
    return next(new Error('no email provided for commenter'));
  }
  if (!req.body.content) {
    return next(new Error('no content provided for commenter'));
  }

  var conditions = {};
  try {
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    conditions.slug = req.params.id;
  }

  Post.findOne(conditions).exec(function (err, post) {
    if (err) {
      return next(err);
    }

    var comment = {
      email: req.body.email,
      content: req.body.content,
      created: new Date()
    };

    post.comments.unshift(comment);
    post.markModified('comments');

    post.save(function (err, post) {
      req.flash('info', '评论添加成功');
      res.redirect('/posts/view/' + post.slug);
    });
  });
});

