var express = require('express');
var router = express.Router();
var pollController = require('../controllers/PollController');

/* GET home page. */
router.get('/', pollController.pollList);

module.exports = router;
