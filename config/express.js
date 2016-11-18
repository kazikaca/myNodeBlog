var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');//控制台输出请求日志
var moment = require('moment');
var truncate = require('truncate');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var compress = require('compression');//压缩和处理静态文件
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var messages = require('express-messages');

//service
var CategoryServ = require('../app/service/categoryService');
var UserServ = require('../app/service/userService');

module.exports = function(app, config, connection) {
    var env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.use(function (req, res, next) {
        app.locals.pageName = req.path;
        app.locals.moment = moment;
        app.locals.truncate = truncate;
        CategoryServ.getAllCategories(function (err, categories) {
            if (err) {
                return next(err);
            }
            app.locals.categories = categories;
            next();
        });
    });

    // app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(expressValidator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.')
                , root    = namespace.shift()
                , formParam = root;

            while(namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param : formParam,
                msg   : msg,
                value : value
            };
        }
    }));

    app.use(cookieParser());
    app.use(session({
        secret: 'nodeblog',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
        store: new MongoStore({ mongooseConnection: connection })
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function (req, res, next) {
        req.sessionUser = null;
        if(req.session.passport && req.session.passport.user){
            UserServ.getUserById(req.session.passport.user,function (err, user) {
                if(err) return next(err);

                user.password = null;
                req.sessionUser = user;//req.sessionUser不带有密码
                next();
            });
        }else{
            next();
        }
    });

    app.use(flash());
    app.use(function (req, res, next) {
        res.locals.messages = messages(req, res);
        app.locals.currentUser = req.sessionUser;
        next();
    });

    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.use(methodOverride());

    var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if(app.get('env') === 'development'){
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });

};
