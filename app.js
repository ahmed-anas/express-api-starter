process.env.NODE_ENV = process.env.CITY_STREAM_SERVER_ENV || process.env.NODE_ENV || 'development';


console.log('ENV: ', process.env.NODE_ENV);


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

require('./app/libs/extensions.lib');

var config = require('./config/config');

var index = require('./routes/index');
var users = require('./app/users/user.auth.route');
var userAccount = require('./app/users/user.account.route');


//initialize passport.js strategies
config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
    require(path.resolve(strategy))();
});

var db = require('./config/db');


config.getGlobbedFiles('./app/**/*.sequelize.model.js').forEach(function (file) {
    require(path.resolve(file));
});

db.getSequelize().sync({force: true}).then(v => {
}).catch(err => {
    throw err;
})

// db.initSchema().then(() => {
//     return db.seedDb();
// }).catch(err => {
//     console.error("Error in db initializaiton");
//     console.error(err.toString());
//     process.exit(1);
// })



var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', index);
app.use('/auth', users);

app.use('/user', userAccount);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = config.env === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
