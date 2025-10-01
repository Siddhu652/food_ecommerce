const { where } = require("sequelize");
const { User, Vendor, sequelize } = require("../models");
const { bucket } = require("../config/firebase");
const bcrypt = require("bcrypt");
// vendorController.js
const { validEmail, validTime, isImage, validPhone } = require("../utils/validation");
const vendor_signup = async (req, res) => {
  const t = await sequelize.transaction();
  console.log("req.body:", req.body);
console.log("req.file:", req.file);
// console.log("req.files:", req.files);
console.log("bucket:", bucket);


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

    // if (!req.file){
    //   return res.status(400).json({ message: "Restaurant image required" });
    // }

    if (!email || !password || !restaurant_name) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    //image processing
    if (!req.file) {
      return res.status(400).json({ message: "Restaurant image required" });
    }

    if(!isImage(req.file)){
      return res.status(415).json({ message : "only images(.img, .png, .jpg, .jpeg) are allowed to upload"});
    }
    // Firebase upload
    const fileName = `restaurants/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    if (!validEmail(email)) {
      return res.status(400).json({
        status: 400,
        message: "email is not valid format",
      });
    }

    if (!validTime(opening_time) || !validTime(closing_time)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid time format please give time format as 12Hours AM/PM",
      });
    }

    if(!validPhone(phoneNo)){
       return res.status(400).json({
        status: 400,
        message: "Enter a valid 10 digit phone number",
      });
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
        restaurant_image: publicUrl,
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
