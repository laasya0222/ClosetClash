const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * GET /community
 * Display a list of all users.
 */
const userList = async (req, res, next) => {
  try {
    // Find all users except for the currently logged-in user
    const users = await User.find({ _id: { $ne: req.user._id } }).sort({ email: 1 });
    res.render('community', { title: 'Community', users: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { userList };