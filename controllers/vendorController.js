const { where } = require("sequelize");
const { User, Vendor } = require("../models");

const bcrypt = require("bcrypt");
const validation = require('../utils/validation')
const vendor_signup = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      user_name,
      password,
      email,
      phoneNo,
      restaurant_name,
      license_number,
      address,
      city,
      landmark,
      opening_time,
      closing_time,
      latitude,
      longitude,
    } = req.body;

    if (!req.file){
      return res.status(400).json({ message: "Restaurant image required" });
    }

    const restaurant_image = req.file ? req.file.filename : null;
    if (!email || !password || !restaurant_name) {
      return res.status(400).json({ message: "Required fields missing" });
    }


    if(!validEmail(email)){
      return res.status(400).json({
        status: 400,
        message : "email is not valid format"
      })
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const add_user_vendor = await User.create(
      {
        userName: user_name,
        email: email,
        password: hashedPass,
        phoneNumber: phoneNo,
        role: "vendor",
      },
      { transaction: t }
    );

    
    const add_vendor_detail = await Vendor.create(
      {
        user_id: add_user_vendor.id,
        restaurant_name,
        license_number,
        address,
        city,
        landmark,
        restaurant_image,
        opening_time,
        closing_time,
        latitude,
        longitude,
        status: "pending",
      },
      { transaction: t }
    );

    const safeUser = {
      id: add_user_vendor.id,
      userName: add_user_vendor.userName,
      email: add_user_vendor.email,
      phoneNumber: add_user_vendor.phoneNumber,
      role: add_user_vendor.role,
    };

    await t.commit();
    res.status(201).json({
      message: "success",
      user: safeUser,
      vendor: add_vendor_detail,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { vendor_signup };
