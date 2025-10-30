#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('closet-clash:server');
var http = require('http');
const mongoose = require('mongoose');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces,
 * but only after the database is connected.
 */

mongoose.connection.on('connected', () => {
  console.log('Database connected. Starting server...');
  server.listen(port, '0.0.0.0'); // Listen on all available network interfaces
  server.on('error', onError);
  server.on('listening', onListening);
});

mongoose.connection.on('error', (err) => {
  // This will catch errors after the initial connection, but we also have
  // the initial connection handler in db.js. This is a good fallback.
  console.error('A database connection error occurred. Server not started.', err);
  process.exit(1);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  // ... (standard error handling)
  throw error;
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Server listening on ' + bind);
}