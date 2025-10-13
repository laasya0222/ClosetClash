const mongoose = require('mongoose');
const Outfit = require('mongoose').model('Outfit');

const closet = async (req, res, next) => {
  try {
    // Find outfits for the current user and populate author details for comments
    const outfits = await Outfit.find({ user: req.user._id })
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });

    res.render('closet', {
      title: 'My Closet',
      outfits: outfits
    });
  } catch (err) {
    next(err);
  }
};

const upload = async (req, res, next) => {
  const { name, image } = req.body;
  try {
    await Outfit.create({
      name,
      image,
      user: req.user._id
    });
    res.redirect('/closet');
  } catch (err) {
    next(err);
  }
};

const addLike = async (req, res, next) => {
  try {
    const outfit = await Outfit.findByIdAndUpdate(req.params.outfitid, { $inc: { likes: 1 } }, { new: true });
    res.status(200).json({ likes: outfit.likes });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  const { text } = req.body;
  const { outfitid } = req.params;
  try {
    const outfit = await Outfit.findByIdAndUpdate(outfitid, {
      $push: {
        comments: {
          text: text,
          author: req.user._id,
          // Use username for display if available, otherwise email
          authorEmail: req.user.username || req.user.email
        }
      }
    });
    // Redirect back to the page the user was on
    res.redirect('back');
  } catch (err) {
    next(err);
  }
};

module.exports = { closet, upload, addLike, addComment };