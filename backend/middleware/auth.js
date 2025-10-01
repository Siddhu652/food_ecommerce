const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const app = express();
app.use(express.json());

const { verifyAccessToken } = require('../utils/jwt');

async function verifyToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'No token' });

  try {
    const payload = verifyAccessToken(token); // throws on invalid/expired
    // OPTIONAL: small DB check if you want live user state (role changed/deactivated)
    // const user = await User.findByPk(payload.id);
    // if(!user) return res.status(401).json({ message: 'User not found' });
    // if(user.role !== payload.role) // handle change
    req.user = payload; // { id, role, vendorId, iat, exp }
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function authorizeRoles(...allowed){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if(!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
