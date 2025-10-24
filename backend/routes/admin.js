const express = require("express")
const router = express.Router();

const {verifyToken, adminOnly} = require("../middleware/auth")

const adminController =require("../controllers/adminController");

router.post("/approval", verifyToken, adminOnly("admin"), adminController);