const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const vendorController = require("../controllers/vendorController");
const restaurant_image_upload = require("../middleware/vendorImageUpload");

router.post("/signup", restaurant_image_upload.single("res_img"), vendorController.vendor_signup);

router.get("/authcheck", verifyToken, authorizeRoles("vendor"), (req, res) => {
  res.json({ message: `Welcome Vendor ${req.user.id}` });
});

module.exports = router;
