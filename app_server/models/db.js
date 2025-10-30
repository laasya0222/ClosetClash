 require('dotenv').config();
 const mongoose = require('mongoose');
 const dbURI = process.env.DB_URI;

 mongoose.connect(dbURI)
   .catch(err => {
     console.error('Initial Mongoose connection error:', err.message);
     console.error('\nPlease ensure your MongoDB server is running and accessible at the specified URI.');
     process.exit(1); // Exit the process with an error code
   });
 
 mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
   });
    mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`);
 });
 mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
 });
 
 const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}`);
  callback();
 };
 
 // For nodemon restarts
 process.once('SIGUSR2', async () => {
  await gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
 });
 // For app termination
 process.on('SIGINT', async () => {
  await gracefulShutdown('app termination', () => {
    process.exit(0);
  });
 });
 // For Heroku app termination
 process.on('SIGTERM', async () => {
  await gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
     });
 });