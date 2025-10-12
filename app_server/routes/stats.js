var express = require('express');
var router = express.Router();

// Import the outfits array from closet.js for demo (simulate shared data)
const { outfits } = require('./closet');

// For demo, use a hardcoded vote count
let voteCount = 42;

router.get('/', function(req, res, next) {
  // In a real app, this data would likely come from a database.
  const outfitCount = outfits.length;
  res.render('stats', {
    title: 'Style Stats',
    outfitCount,
    voteCount
  });
});

module.exports = router;
