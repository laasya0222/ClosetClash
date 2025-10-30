const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const Outfit = mongoose.model('Outfit');

// Handle user registration
const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // User.register is a static method from passport-local-mongoose
    // It handles hashing and saving the user in one step.
    const user = new User({ username: username, email: email });
    await User.register(user, password);
    // After successful registration, log the user in and redirect.
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/closet');
    });
  } catch (err) {
    console.error(err);
    res.render('register', { title: 'Register', error: err.message });
  }
};

// Handle user login
const login = (req, res, next) => {
  // Use passport.authenticate with a custom callback to handle AJAX requests
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'An internal server error occurred.' });
    }
    if (!user) {
      // Authentication failed. Send back the error message from passport-local-mongoose.
      return res.status(401).json({ message: info.message || 'Invalid credentials.' });
    }
    // Authentication succeeded. Establish a session.
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to establish a session.' });
      }
      // Send a success response with the redirect path.
      return res.status(200).json({ redirectTo: '/closet' });
    });
  })(req, res, next);
};

// Handle user logout
const logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

const viewProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userid).lean();
    if (!user) {
      return res.status(404).send('User not found');
    }

    const outfits = await Outfit.find({ user: req.params.userid })
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });

    res.render('user-profile', {
      title: `${user.username}'s Closet`,
      profileUser: user,
      outfits: outfits
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  viewProfile
};