const bcrypt = require("bcrypt");
const { User, Role } = require("../models");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");
// const { messaging } = require("firebase-admin");

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


const update_user = async (req, res) => {
  try {
    const { userId, userName, email, phoneNumber, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      user.password = hashedPass;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const user_login = async (req, res) => {
  const { email, password } = req.body;

const user = await User.findOne({
  where: { email },
  include: {
    model: Role,
    through: { attributes: [] }, 
    attributes: ["id", "role_name"],  
  },
});

const roles = user.Roles.map(r => r.role_name);

if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Create tokens
const accessToken = signAccessToken({
  id: user.id,
  roles: user.Roles.map(r => r.name),
});

const refreshToken = signRefreshToken({
  id: user.id,
  roles: user.Roles.map(r => r.name),
});

  // const refreshToken = signRefreshToken({ id: user.id, role: user.role });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.status(200).json({
    status: "success",
    message: "Login success",
    data: {
    name: user.userName,
    roles: roles,    
    accessToken,                  
    refreshToken
    }
  });
};

const user_logout = async(req, res)=>{
  const {userId} = req.body;
  const find_user = await User.findByPk(userId);
  if(!find_user){
    res.status(404).json({
      status: "error",
      message : "user not found, give us the existing user's id to logout"
    })
  }
 
  find_user.refreshToken = null;
  await find_user.save();

   res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
  });


  return res.status(200).json({
    status: "success",
    message : "Logged out successfully"
  })
}

module.exports = { get_all_user, get_particular_user, user_login, user_logout, update_user};
