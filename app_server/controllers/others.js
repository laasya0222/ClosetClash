const mongoose = require('mongoose');
const Outfit = mongoose.model('Outfit');

/* GET 'home' page */
const home = async (req, res, next) => {
  try {
    // Fetch top 3 most liked outfits to showcase on the homepage
    const featuredOutfits = await Outfit.find({})
      .sort({ likes: -1 })
      .limit(3)
      .populate('user', 'email'); // Get the owner's email

    res.render('home', {
      title: 'Closet Clash - Virtual Wardrobe Battle',
      featuredOutfits: featuredOutfits
    });
  } catch (err) {
    next(err);
  }
};

/* GET 'about' page */
 const about = (req, res) => {
  res.render('generic-text', { title: 'About' });
 };
 module.exports = {
  home,
  about
};