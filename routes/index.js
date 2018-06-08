var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yo Mama' });
});

module.exports = router;
