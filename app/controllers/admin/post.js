var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    slug = require('slug'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Category = mongoose.model('Category'),
    tool = require('../../common/tool'),
    PostServ = require('../../service/postService');

module.exports = function (app) {
    app.use('/admin/posts', router);
};

router.get('/', tool.requireLogin, function (req, res, next) {
    // sort
    var sortby = req.query.sortby ? req.query.sortby : 'created';
    var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';

    if (['title', 'category', 'author', 'created', 'published'].indexOf(sortby) === -1) {
        sortby = 'created';
    }
    if (['desc', 'asc'].indexOf(sortdir) === -1) {
        sortdir = 'desc';
    }

    var sortObj = {};
    sortObj[sortby] = sortdir;

    // condition
    var conditions = {};
    if (req.query.category) {
        conditions.category = req.query.category.trim();
    }
    if (req.query.author) {
        conditions.author = req.query.author.trim();
    }

    User.find({}, function (err, authors) {

        if (err) return next(err);

        PostServ.getPostsWithQuery(conditions, sortObj, ['author', 'category'], function (err, posts) {
            if (err) return next(err);

            var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
            var pageSize = 10;

            var totalCount = posts.length;
            var pageCount = Math.ceil(totalCount / pageSize);

            if (pageNum > pageCount) {
                pageNum = pageCount;
            }

            res.render('admin/post/index', {
                posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
                pageNum: pageNum,
                pageCount: pageCount,
                authors: authors,
                sortdir: sortdir,
                sortby: sortby,
                pretty: true,
                filter: {
                    category: req.query.category || "",
                    author: req.query.author || ""
                }
            });
        });
    });
});

router.get('/add', tool.requireLogin, function (req, res, next) {
    res.render('admin/post/add', {
        pretty: true,
        post: {
            category: {_id: ''}
        }
    });
});

router.post('/add', tool.requireLogin, function (req, res, next) {

    //表单验证
    req.checkBody('title','标题不能为空').notEmpty();
    req.checkBody('category','请指定分类').notEmpty();
    req.checkBody('content','内容不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.render('admin/post/add',{
            formInvalids : errors,
            post:{
                title : req.body.title,
                category : {
                    _id :req.body.category
                },
                content : req.body.content
            }
        });
    }

    var title = tool.chgToPinyin(req.body.title.trim());
    var category = req.body.category;
    var content = req.body.content;

    User.findOne({}, function (err, author) {
        if (err) {
            return next(err);
        }

        var post = new Post({
            title: title,
            slug: slug(title),
            category: category,
            content: content,
            author: author,
            published: true,
            meta: {favorite: 0},
            comments: [],
            created: new Date()
        });

        post.save(function (err) {
            if (err) {
                console.log('posts/add error:', err);
                req.flash('error', '文章保存失败');
                res.redirect('/admin/posts/add');
            } else {
                req.flash('info', '文章保存成功');
                res.redirect('/admin/posts');
            }
        });
    })
});

router.get('/edit/:id', tool.requireLogin, findPostById, function (req, res, next) {

    res.render('admin/post/add', {
        pretty: true,
        post: req.post
    });

});

router.post('/edit/:id', tool.requireLogin, findPostById, function (req, res, next) {

    var post = req.post;

    var title = req.body.title.trim();
    var category = req.body.category.trim();
    var content = req.body.content;

    post.title = title;
    post.category = category;
    post.content = content;

    post.save(function (err) {
        if (err) {
            console.log('post edit err:' + err);
            req.flash('error', '文章编辑失败');
            res.redirect('/admin/posts/edit/' + post._id);
        } else {
            req.flash('info', '文章编辑成功');
            res.redirect('/admin/posts');
        }
    })

});

router.get('/delete/:id', tool.requireLogin, function (req, res, next) {
    var postId = req.params.id;
    if (!postId) {
        return next(new Error('no post id provided'));
    }

    PostServ.removePostById(postId, function (err, rowsRemoved) {
        if (err) {
            return next(err);
        }

        if (rowsRemoved) {
            req.flash('success', '文章删除成功');
        } else {
            req.flash('error', '文章删除失败');
        }

        res.redirect('/admin/posts');
    });
});

function findPostById(req, res, next) {
    var postId = req.params.id;
    if (!postId) {
        return next(new Error('no post id provided'));
    }
    PostServ.getPostById(postId, function (err, post) {

        if (err)return next(err);

        if (!post) {
            return next(new Error('post not found:' + postId));
        }

        req.post = post;
        next();

    });
}
