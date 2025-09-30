var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
router.get("/", userController.get_all_user);
router.get("/:id", userController.get_particular_user);

module.exports = router;
