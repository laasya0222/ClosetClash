/* GET 'home' page */
const home = (req, res) => {
  res.render('index', { title: 'ClosetClash' });
};

/* GET 'about' page */
 const about = (req, res) => {
  res.render('generic-text', { title: 'About' });
 };
 module.exports = {
  home,
  about
};