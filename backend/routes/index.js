var express = require('express');
var router = express.Router();

const userRoutes = require('./users');
// const customerRoutes = require('./customers');
const vendorRoutes = require('./vendors');
/* GET home page. */

// console.log('userRoutes:', userRoutes);
// console.log('customerRoutes:', customerRoutes);
// console.log('vendorRoutes:', vendorRoutes);

router.use('/user', userRoutes);
// router.use('/customer', customerRoutes);
router.use('/vendor', vendorRoutes);
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
