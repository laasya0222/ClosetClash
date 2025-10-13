const mongoose = require('mongoose');
const passport = require('passport');
const User = require('mongoose').model('User');
const Outfit = require('mongoose').model('Outfit');

// Handle user registration
const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // User.register is a static method from passport-local-mongoose
    // It handles hashing and saving the user in one step.
    await User.register(new User({ username: username, email: email }), password);
    // After successful registration, log the user in and redirect.
    passport.authenticate('local')(req, res, function () {
      res.redirect('/closet');
    });
  } catch (err) {
    console.error(err);
    res.render('register', { title: 'Register', error: err.message });
  }
};

// Handle user login
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return res.status(500).json({ message: 'An internal server error occurred.' }); }
    if (!user) {
      // Authentication failed. Send back the error message from passport-local-mongoose.
      // This is typically "Incorrect username" or "Incorrect password".
      return res.status(401).json({ message: info.message || 'Invalid credentials.' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed due to a server error.' });
      }
      // Authentication successful. Send a success response with a redirect URL.
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