const mongoose = require('mongoose');
const Outfit = mongoose.model('Outfit');
 
const battle = async (req, res, next) => {
  try {
    // Find outfits the current user has NOT voted on yet
    const availableOutfits = await Outfit.aggregate([
      { $match: { voters: { $ne: req.user._id } } },
      { $sample: { size: 4 } }, // Fetch 4 potential outfits
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'owner' } }
    ]);
 
    // 1. Filter out outfits without a valid owner and flatten the owner array to an object.
    const validOutfits = availableOutfits
      .filter(outfit => outfit.owner && outfit.owner.length > 0)
      .map(outfit => {
        outfit.owner = outfit.owner[0];
        return outfit;
      });

    // 2. Create pairs of outfits for the battles.
    const completeBattles = validOutfits
      .reduce((acc, cur, i) => {
        if (i % 2 === 0) {
          acc.push([cur]);
        } else {
          acc[acc.length - 1].push(cur);
        }
        return acc;
      }, [])
      .filter(pair => pair.length === 2);

    // If there are no complete battles, check if it's because the user has voted on everything
    if (completeBattles.length === 0) {
      const totalOutfits = await Outfit.countDocuments({ user: { $ne: req.user._id } });
      // If outfits exist but none are available for this user, they've voted on all of them
      if (totalOutfits > 1) {
        return res.render('battle-arena', {
          title: 'All Done!',
          battles: [],
          message: "You've voted on all available battles! Check back later for new outfits."
        });
      }
    }

    res.render('battle-arena', {
      title: 'Closet Clash: Battle Arena',
      battles: completeBattles,
      message: "Not enough outfits in the community to start a battle. Upload more looks!"
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
 
const vote = async (req, res, next) => {
  const { winner, loser } = req.body;
 
  if (!winner || !loser) {
    return res.redirect('/battle');
  }
 
  try {
    // Increment wins for the winner and battlesPlayed for both
    // Also, add the current user to the 'voters' array for both outfits to prevent re-voting.
    await Promise.all([
      Outfit.findByIdAndUpdate(winner, { 
        $inc: { wins: 1, battlesPlayed: 1 },
        $addToSet: { voters: req.user._id } 
      }),
      Outfit.findByIdAndUpdate(loser, { 
        $inc: { battlesPlayed: 1 },
        $addToSet: { voters: req.user._id }
      })
    ]);

    // The client only needs the winner's ID to confirm the vote.
    res.status(200).json({ winnerId: winner });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
 
module.exports = {
  battle,
  vote
};