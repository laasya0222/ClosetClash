var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Outfit = mongoose.model('Outfit');
const { isLoggedIn } = require('../controllers/auth');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    // Find outfits belonging to the current user
    const userOutfits = await Outfit.find({ user: req.user._id });
    const numOutfits = userOutfits.length;

    if (numOutfits === 0) {
      return res.render('stats', {
        title: 'My Style Stats',
        stats: { numOutfits: 0 }
      });
    }

    let totalWins = 0;
    let totalBattles = 0;
    let bestOutfit = null;
    let mostLikedOutfit = null;
    let bestWinRate = -1;
    let maxLikes = -1;

    userOutfits.forEach(outfit => {
      const winRate = outfit.battlesPlayed > 0 ? (outfit.wins / outfit.battlesPlayed) * 100 : 0;
      // Since we are not using .lean(), we can't just add properties.
      // We will handle this in the template or pass a transformed object if needed.
      // For this fix, we'll calculate it on the fly.

      totalWins += outfit.wins || 0;
      totalBattles += outfit.battlesPlayed || 0;

      if (winRate > bestWinRate) {
        bestOutfit = outfit;
        bestWinRate = winRate;
      }

      if ((outfit.likes || 0) > maxLikes) {
        mostLikedOutfit = outfit;
        maxLikes = outfit.likes;
      }
    });

    res.render('stats', {
      title: 'My Style Stats',
      userOutfits: userOutfits.map(o => ({...o.toObject(), winRate: o.battlesPlayed > 0 ? (o.wins / o.battlesPlayed) * 100 : 0})),
      stats: { numOutfits, totalWins, totalBattles, bestOutfit, mostLikedOutfit }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
