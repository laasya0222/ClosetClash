const express = require('express');
const router = express.Router();

// TODO: Define and import your controllers. For example:
const ctrlOthers = require('../controllers/others');

/* Home page */
router.get('/', ctrlOthers.home);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;