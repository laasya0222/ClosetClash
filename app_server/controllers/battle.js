/* GET 'battle' page */
const battle = (req, res) => {
  // Hardcoded outfits for demo
  const outfits = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
      description: 'Red Dress with Heels'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
      description: 'Casual Denim Look'
    }
  ];

  res.render('battle-arena', {
    title: 'Closet Clash: Battle Arena',
    outfits
  });
};

module.exports = {
  battle
};