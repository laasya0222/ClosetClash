 const mongoose = require('mongoose');
 // Use the environment variable on Render, otherwise use the local database
 const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/ClosetClash';
 
 // Mongoose connection logic
 async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(dbURI, {});
    } catch (err) {
      console.error(`Mongoose connection error: ${err}`);
      // Exit process with failure
      process.exit(1);
    }
  }
 }
 
 connectDB();
 
 mongoose.connection.on('connected', () => {
   console.log(`Mongoose connected to ${dbURI}`);
 });
 mongoose.connection.on('error', err => {
   console.log(`Mongoose connection error: ${err}`);
 });
 mongoose.connection.on('disconnected', () => {
   console.log('Mongoose disconnected');
 });
 
 const gracefulShutdown = (msg, callback) => {
   mongoose.connection.close( () => {
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