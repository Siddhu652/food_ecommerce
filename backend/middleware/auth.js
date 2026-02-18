const { User } = require("../models");
const { verifyAccessToken } = require("../utils/jwt");

async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // console.log("AUTH HEADER:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  // console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const payload = verifyAccessToken(token);
    // console.log("PAYLOAD:", payload);

    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      roles: payload.roles || [],
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


function authorizeRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!allowed.some((role) => req.user.roles.includes(role))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
