const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'Username is required',
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: 'Email address is required',
    // Use a regular expression to validate the email format
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ],
    lowercase: true // Store emails in lowercase to prevent duplicates
  },
  // Add timestamps to track when a user is created or updated
}, { timestamps: true });

// This will add username, hash and salt fields to store the username, the hashed password and the salt value
// It also adds some methods to the user schema
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

mongoose.model('User', userSchema);