const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const vendorController = require("../controllers/vendorController");
const restaurant_image_upload = require("../middleware/vendorImageUpload");
const validate = require("../middleware/validate");
const { vendorSignupSchema } = require("../utils/joiValidation");


router.post("/signup",
restaurant_image_upload.single("res_img"), 
validate(vendorSignupSchema),
vendorController.vendor_signup);

router.get("/profile/:userId", verifyToken, authorizeRoles("vendor"), vendorController.get_vendor_profile);

router.put("/update-profile",
verifyToken, 
authorizeRoles("vendor"),
restaurant_image_upload.single("restaurant_img"),
vendorController.profile_update);

module.exports = router;
