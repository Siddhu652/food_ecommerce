const express = require("express");
const router = express.Router();
const { user_login, user_logout } = require("../controllers/userController");
const { verifyRefreshToken, signAccessToken } = require("../utils/jwt");
const { User } = require("../models");


router.post("/login", user_login);
router.post("/logout", user_logout);
router.post("/refresh", async (req, res) => {
  try {
const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const payload = verifyRefreshToken(refreshToken);

    const foundUser = await User.findOne({ where: { id: payload.id, refreshToken } });
    if (!foundUser) return res.status(403).json({ message: "Refresh token invalid" });

    const newAccessToken = signAccessToken({ id: foundUser.id, email: foundUser.email });

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
