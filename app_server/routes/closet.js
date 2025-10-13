const express = require('express');
const router = express.Router();
const { closet, upload, addLike, addComment } = require('../controllers/closet');
const { isLoggedIn } = require('../controllers/auth');

// All closet routes should be protected
router.use(isLoggedIn);

// GET closet page
router.get('/', closet);

// POST to upload a new outfit
router.post('/upload', upload);

router.post('/:outfitid/like', addLike);
router.post('/:outfitid/comment', addComment);

module.exports = router;