const mongoose = require('mongoose');

let dbURI = 'mongodb://localhost/ClosetClash';
if (process.env.NODE_ENV === 'production') {
  // MONGODB_URI is the conventional name for the connection string variable.
  // Render and other hosts will provide this.
  dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// For nodemon restarts
process.once('SIGUSR2', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination (nodemon restart)');
    process.kill(process.pid, 'SIGUSR2');
  });
});