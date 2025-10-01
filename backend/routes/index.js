var express = require('express');
var router = express.Router();

const authRoutes = require('./auth');     
const userRoutes = require('./users');    
const vendorRoutes = require('./vendors');  
const customerRoutes = require('./customers');

router.use('/auth', authRoutes);

router.use('/user', userRoutes);
router.use('/vendor', vendorRoutes);
// router.use('/customer', customerRoutes);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
