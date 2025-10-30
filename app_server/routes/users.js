const express = require('express');
const router = express.Router();
const { register, login, logout, viewProfile } = require('../controllers/users');
const { isLoggedIn } = require('../controllers/auth');

// GET /users/register - Display registration form
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// GET /users/login - Display login form
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// POST routes
router.post('/register', register);
router.post('/login', login);

// GET /users/logout
router.get('/logout', logout);

// GET a specific user's profile page
router.get('/profile/:userid', isLoggedIn, viewProfile);

module.exports = router;