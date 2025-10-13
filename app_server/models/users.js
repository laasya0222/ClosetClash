const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  }
});

// This will add username, hash and salt fields to store the username, the hashed password and the salt value
// It also adds some methods to the user schema
userSchema.plugin(passportLocalMongoose);

mongoose.model('User', userSchema);