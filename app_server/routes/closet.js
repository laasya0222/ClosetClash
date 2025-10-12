var express = require('express');
var router = express.Router();

// Demo: hardcoded outfits array
let outfits = [
  {
    id: 1,
    name: 'Red Dress',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f'
  },
  {
    id: 2,
    name: 'Denim Look',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'
  }
];

// GET closet page
router.get('/', function(req, res, next) {
  res.render('closet', { title: 'My Closet', outfits });
});

// POST upload outfit (demo: just adds to array)
router.post('/upload', function(req, res, next) {
  const { name, image } = req.body;
  if (name && image) {
    outfits.push({ id: outfits.length + 1, name, image });
  }
  res.redirect('/closet');
});

module.exports = {
  router,
  outfits // Exporting for demo purposes in stats.js
};
