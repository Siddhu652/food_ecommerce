const bcrypt = require("bcrypt");
const { User } = require("../models");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");

const get_all_user = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_particular_user = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const user_login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Create tokens
  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role });

  res.status(200).json({
    message: "Login success",
    accessToken,
    refreshToken,
    role: user.role,
  });
};

module.exports = { get_all_user, get_particular_user, user_login };
