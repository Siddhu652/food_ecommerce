const express = require("express");
const router = express.Router();
const { user_login } = require("../controllers/userController");

router.post("/login", user_login);

module.exports = router;
