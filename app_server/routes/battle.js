var express = require('express');
var router = express.Router();
const { battle, vote } = require('../controllers/battle');
const { isLoggedIn } = require('../controllers/auth');

/* GET battle page. */
router.get('/', isLoggedIn, battle);

/* POST to handle a vote */
router.post('/vote', isLoggedIn, vote);

module.exports = router;
