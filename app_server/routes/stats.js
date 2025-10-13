var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Outfit = require('mongoose').model('Outfit');
const { isLoggedIn } = require('../controllers/auth');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    // Find outfits belonging to the current user
    const userOutfits = await Outfit.find({ user: req.user._id }).lean();
    const numOutfits = userOutfits.length;

    if (numOutfits === 0) {
      return res.render('stats', {
        title: 'My Style Stats',
        stats: { numOutfits: 0 }
      });
    }

    let totalWins = 0;
    let totalBattles = 0;
    let bestOutfit = userOutfits[0];
    let mostLikedOutfit = userOutfits[0];

    userOutfits.forEach(outfit => {
      outfit.winRate = outfit.battlesPlayed > 0 ? (outfit.wins / outfit.battlesPlayed) * 100 : 0;
      totalWins += outfit.wins || 0;
      totalBattles += outfit.battlesPlayed || 0;

      const bestWinRate = bestOutfit.battlesPlayed > 0 ? (bestOutfit.wins / bestOutfit.battlesPlayed) * 100 : 0;
      if (outfit.winRate > bestWinRate) {
        bestOutfit = outfit;
      }

      if ((outfit.likes || 0) > (mostLikedOutfit.likes || 0)) {
        mostLikedOutfit = outfit;
      }
    });

    res.render('stats', {
      title: 'My Style Stats',
      outfits: userOutfits,
      stats: { numOutfits, totalWins, totalBattles, bestOutfit, mostLikedOutfit }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
