require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

require('./app_server/models');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var battleRouter = require('./app_server/routes/battle');
var closetRouter = require('./app_server/routes/closet');
var communityRouter = require('./app_server/routes/community');
var statsRouter = require('./app_server/routes/stats');

var app = express();

// BRING IN YOUR SCHEMAS & MODELS
const User = require('mongoose').model('User');

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'a-fallback-secret-for-development',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// This middleware makes the user object available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTERS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/battle', battleRouter);
app.use('/closet', closetRouter);
app.use('/community', communityRouter);
app.use('/stats', statsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('ERROR:', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'Error'; // Always provide a title for error view

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
