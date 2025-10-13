const express = require('express');
const router = express.Router();
const { userList } = require('../controllers/community');
const { isLoggedIn } = require('../controllers/auth');

router.get('/', isLoggedIn, userList);

module.exports = router;