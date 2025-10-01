const { User } = require("../models");
const { verifyAccessToken } = require("../utils/jwt");

async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const payload = verifyAccessToken(token); // throws on invalid/expired
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorizeRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!allowed.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
