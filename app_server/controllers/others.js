/* GET 'home' page */
const home = (req, res) => {
  res.render('home', { title: 'Closet Clash' });
};

/* GET 'about' page */
 const about = (req, res) => {
  res.render('generic-text', { title: 'About' });
 };
 module.exports = {
  home,
  about
};