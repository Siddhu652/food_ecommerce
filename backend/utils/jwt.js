const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Sign access token
function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "40m" });
}

// Sign refresh token
function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }); // longer life
}

// Verify
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
