const mongoose = require('mongoose');
const User = require('mongoose').model('User');

const userList = async (req, res, next) => {
  try {
    // Find all users, but only select their email to display
    const users = await User.find().select('username email _id').lean();
    res.render('community', {
      title: 'Community',
      users: users
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userList
};