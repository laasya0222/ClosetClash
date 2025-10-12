var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var battleRouter = require('./app_server/routes/battle');
var { router: closetRouter } = require('./app_server/routes/closet');
var statsRouter = require('./app_server/routes/stats');
var profileRouter = require('./app_server/routes/profile');

var app = express();

// Determine the database URI
// Use the environment variable on Render, otherwise use the local database
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/ClosetClash';

// Mongoose connection logic
async function connectDB() {
  try {
    // Added options for modern Mongoose versions
    await mongoose.connect(dbURI, {});
  } catch (err) {
    console.error(`Mongoose connection error: ${err}`);
    // Exit process with failure
    process.exit(1);
  }
}

connectDB();

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// For Render app termination
process.on('SIGTERM', () => {
  gracefulShutdown('Render app shutdown', () => {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
// For example: require('./locations');

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');
// Disable view caching to prevent a bug in the deprecated 'jade' package on production.
// This is a workaround to allow continued use of Jade.
// The recommended long-term solution is to migrate to Pug.
app.disable('view cache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/battle', battleRouter);
app.use('/closet', closetRouter);
app.use('/stats', statsRouter);
app.use('/profile', profileRouter);

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
