var express = require('express')
var router = express.Router();
const restaurant_image_upload = require('../middleware/vendorImageUpload');

const vendorController = require("../controllers/vendorController");

router.post("/signup", restaurant_image_upload.single('restaurant_image'),vendorController.vendor_signup);

module.exports = router;