var express = require('express')
var router = express.Router();

const vendorController = require("../controllers/vendorController");

router.post("/signup", vendorController.vendor_signup);

module.exports = router;