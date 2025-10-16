const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const vendorController = require("../controllers/vendorController");
const restaurant_image_upload = require("../middleware/vendorImageUpload");

router.post("/signup", restaurant_image_upload.single("res_img"), vendorController.vendor_signup);

// router.post("/login", verifyToken, authorizeRoles("vendor"), vendorController.vendor_login);
router.post("/profile", verifyToken, authorizeRoles("vendor"), vendorController.get_vendor_profile);

router.put("/update-profile",
     verifyToken, 
    authorizeRoles("vendor"),
restaurant_image_upload.single("res_img"),
vendorController.profile_update);


module.exports = router;
