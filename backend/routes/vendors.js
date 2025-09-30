var express = require('express')
var router = express.Router();
const restaurant_image_upload = require('../middleware/vendorImageUpload');

const vendorController = require("../controllers/vendorController");
// router.post("/test-upload", restaurant_image_upload.single('restaurant_image'), (req, res) => {
//   console.log("file log:", req.file);
//   res.json({ file: req.file });
// });

router.post("/signup", restaurant_image_upload.single('res_img'),vendorController.vendor_signup);

module.exports = router;