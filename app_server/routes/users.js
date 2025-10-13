const express = require('express');
const router = express.Router();
const { register, login, logout, viewProfile } = require('../controllers/users');
const { isLoggedIn } = require('../controllers/auth');

// Registration routes
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});
router.post('/register', register);

// Login routes
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});
router.post('/login', login);

// Logout route
router.get('/logout', logout);

// GET a specific user's public profile
router.get('/profile/:userid', isLoggedIn, viewProfile);

module.exports = router;
