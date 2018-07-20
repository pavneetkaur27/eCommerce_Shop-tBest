var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var mongoDb = require('connect-mongo')(session);
var index = require('./routes/index');
var product = require('./routes/product/product');
var mongoose = require('mongoose');
var helper = require('./helper');
var controllers = require('./controllers/userControllers.js');
var flash = require('connect-flash');


var app = express();

console.log('start');

var mongoConnection = 'mongodb://localhost:27017/products';

mongoose.connect(mongoConnection, {useNewUrlParser: true});
// On connect

mongoose.connection.on('connected', function () {

});

//on error
mongoose.connection.on('error', function (err) {
    console.log('Error occur in mongoose ' + err);
});

//On disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
        secret: 'qwertyuiopasdfghjkl',
        resave: false,
        saveUninitialized: false,
        store: new mongoDb({mongooseConnection: mongoose.connection}),
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    }
    )
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.session = session;
    next();
})
app.use('/', index);
app.use('/product', product);


app.use(flash());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
