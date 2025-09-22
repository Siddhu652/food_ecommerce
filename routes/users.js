var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
router.get("/", userController.get_all_user);
// router.get('/', userController.get_specific_user)
module.exports = router;
