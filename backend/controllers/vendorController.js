const fs = require("fs");
const path = require("path");
const { bucket } = require("../config/firebase");
const { User, Vendor, sequelize } = require("../models");
const bcrypt = require("bcrypt");

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

    if (!req.file) {
      return res.status(400).json({ message: "Restaurant image required" });
    }

    const localFilePath = req.file.path;
    const fileName = `restaurants/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    await bucket.upload(localFilePath, {
      destination: fileName,
      public: true,
      metadata: { contentType: req.file.mimetype },
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    const hashedPass = await bcrypt.hash(password, 3);
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

    await t.commit();

    res.status(201).json({
      message: "success",
      user: {
        id: add_user_vendor.id,
        userName: add_user_vendor.userName,
        email: add_user_vendor.email,
        phoneNumber: add_user_vendor.phoneNumber,
        role: add_user_vendor.role,
      },
      vendor: add_vendor_detail,
    });
  } catch (error) {
    console.error("Vendor signup error:", error); // <-- full error object
    await t.rollback();
    res.status(500).json({
      error: error.message,
      stack: error.stack, // helpful in dev
    });
  }
};

module.exports = { vendor_signup };
