const express = require('express');
const router = express.Router();

// TODO: Define and import your controllers. For example:
// const ctrlLocations = require('../controllers/locations');
// const ctrlOthers = require('../controllers/others');

/* Home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ClosetClash' });
});

// router.get('/location', ctrlLocations.locationInfo);
// router.get('/location/review/new', ctrlLocations.addReview);

// router.get('/about', ctrlOthers.about);

module.exports = router;