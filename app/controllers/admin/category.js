var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category'),
    slug = require('slug'),
    tool = require('../../common/tool'),
    CategoryServ = require('../../service/categoryService');

module.exports = function (app) {
    app.use('/admin/categories', router);
};

router.get('/', tool.requireLogin, function (req, res, next) {
    CategoryServ.getAllCategories(function (err, categories) {
        if (err)return next(err);
        res.render('admin/category/index', {
            title: '分类列表',
            categories: categories,
            pretty: true
        });
    });
});

router.get('/add', tool.requireLogin, function (req, res, next) {
    res.render('admin/category/add', {
        title: '添加分类',
        pretty: true,
        category: {}
    });
});

router.post('/add', tool.requireLogin, function (req, res, next) {

    //表单验证
    req.checkBody('name','名称不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.render('admin/category/add',{
            formInvalids : errors,
            category: {
                name: req.body.name
            }
        });
    }

    var name = req.body.name.trim();

    var newCategory = new Category({
        name: name,
        slug: slug(tool.chgToPinyin(name))
    });

    newCategory.save(function (err, category) {
        if (err) {
            console.log('categories/add error:', err);
            req.flash('error', '分类保存失败');
            res.redirect('/admin/categories/add');
        } else {
            req.flash('info', '分类添加成功');
            res.redirect('/admin/categories');
        }
    });

});

router.get('/edit/:id', tool.requireLogin, getTheCategoryById, function (req, res, next) {
    res.render('admin/category/add', {
        title: '编辑分类',
        pretty: true,
        category: req.category
    });
});

router.post('/edit/:id', tool.requireLogin, getTheCategoryById, function (req, res, next) {

    var category = req.category;
    var name = req.body.name.trim();

    //表单验证
    req.checkBody('name','名称不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.render('admin/category/add',{
            formInvalids : errors,
            category: {
                name: name
            }
        });
    }

    category.name = name;
    category.slug = slug(tool.chgToPinyin(name));

    category.save(function (err) {
        if (err) {
            console.log('categories/add error:', err);
            req.flash('error', '分类修改失败');
            res.redirect('/admin/categories/edit/'+category._id);
        } else {
            req.flash('info', '分类修改成功');
            res.redirect('/admin/categories');
        }
    });
});

router.get('/delete/:id', tool.requireLogin, function (req, res, next) {
    var _id = req.params.id;
    if(!_id)return next(new Error('no category id provided'));

    CategoryServ.removeCategoryById(_id,function (err, rowsRemoved) {
        if(err)return next(err);

        if (rowsRemoved) {
            req.flash('success', '分类删除成功');
        } else {
            req.flash('error', '分类删除失败');
        }

        res.redirect('/admin/categories');
    });
});

function getTheCategoryById(req, res, next) {
    var _id = req.params.id;
    if (!_id)return next(new Error('no category id provided'));

    CategoryServ.getCategoryById(_id, function (err, category) {
        if (err)return next(err);

        if (!category)return next(new Error('category not found'));

        req.category = category;
        next();
    });
}

