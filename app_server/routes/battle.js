var express = require('express');
var router = express.Router();
const ctrlBattle = require('../controllers/battle');

/* GET battle page. */
router.get('/', ctrlBattle.battle);

module.exports = router;
