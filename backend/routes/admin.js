const express = require("express")
const router = express.Router();

const {verifyToken, adminOnly} = require("../middleware/auth")

const {restaurant_approval} =require("../controllers/adminController");

router.post("/approval", verifyToken, adminOnly("admin"), restaurant_approval);