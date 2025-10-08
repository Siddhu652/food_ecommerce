const { Readable } = require("stream");
const bcrypt = require("bcrypt");
const { bucket } = require("../config/firebase");
const { User, Vendor, sequelize } = require("../models");

const vendor_signup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      user_name, password, email, phoneNo,
      restaurant_name, license_number,
      address, city, landmark, opening_time, closing_time,
      latitude, longitude
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Restaurant image required" });
    }

    const fileName = `restaurants/${Date.now()}_${req.file.originalname}`;
    const contentType = req.file.mimetype;
    const fileBuffer = req.file.buffer; // Memory buffer

    // Hash password
    const hashedPass = await bcrypt.hash(password, 3);

    // Create User + Vendor records first
    const add_user_vendor = await User.create({
      userName: user_name,
      email,
      password: hashedPass,
      phoneNumber: phoneNo,
      role: "vendor",
    }, { transaction: t });

    const add_vendor_detail = await Vendor.create({
      user_id: add_user_vendor.id,
      restaurant_name,
      license_number,
      address,
      city,
      landmark,
      // restaurant_image: null, // Will update after upload
      opening_time,
      closing_time,
      latitude,
      longitude,
      status: "pending",
    }, { transaction: t });

    await t.commit();

    // ✅ Stream upload to Firebase (async background)
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: { contentType },
      public: true,
    });

    const stream = Readable.from(fileBuffer);
    stream.pipe(blobStream)
      .on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        await Vendor.update(
          { restaurant_image: publicUrl },
          { where: { id: add_vendor_detail.id } }
        );
      })
      .on("error", (err) => {
        console.error("Firebase stream upload failed:", err);
      });

    // ✅ Respond immediately (upload continues in background)
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
    await t.rollback();
    console.error("Vendor signup error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { vendor_signup };
