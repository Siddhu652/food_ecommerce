const express = require("express")
const router = express.Router();

const {verifyToken, authorizeRoles} = require("../middleware/auth")

const {restaurant_approval} =require("../controllers/adminController");

router.post("/approval", verifyToken, authorizeRoles("admin"), restaurant_approval);

module.exports = router;