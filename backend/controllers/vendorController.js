const { Readable } = require("stream");
const bcrypt = require("bcrypt");
const { bucket } = require("../config/firebase");
const { User, Vendor, sequelize } = require("../models");
const { where } = require("sequelize");

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

    const fileName = `restaurants/${Date.now()}_${req.file.originalname}`;
    const contentType = req.file.mimetype;
    const fileBuffer = req.file.buffer;

    const hashedPass = await bcrypt.hash(password, 3);

    const add_user_vendor = await User.create(
      {
        userName: user_name,
        email,
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
        opening_time,
        closing_time,
        latitude,
        longitude,
        status: "pending",
      },
      { transaction: t }
    );

    await t.commit();

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: { contentType },
      public: true,
    });

    const stream = Readable.from(fileBuffer);
    stream
      .pipe(blobStream)
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

const get_vendor_profile = async (req, res) => {
  try{
  const userId = req.user.id;

  const vendor_detail = await Vendor.findOne({
    where: {
      user_id: userId,
    },
    include: {
      model: User,
      attributes: ["id", "userName", "email", "phoneNumber", "role"],
    },
  });
  if (!vendor_detail) {
    return res.status(404).json({ message: "Vendor profile not found" });
  }

  const responseData = {
      vendorId: vendor_detail.id,
      userId: vendor_detail.user_id,
      restaurantName: vendor_detail.restaurant_name,
      restaurantImage: vendor_detail.restaurant_image,
      status: vendor_detail.status, 
      role: vendor_detail.User.role,

      contact: {
        phoneNumber: vendor_detail.User.phoneNumber,
        email: vendor_detail.User.email,
      },

      location: {
        address: vendor_detail.address,
        landmark: vendor_detail.landmark,
        city: vendor_detail.city,
        latitude: vendor_detail.latitude,
        longitude: vendor_detail.longitude,
      },

      operatingDetails: {
        openingTime: vendor_detail.opening_time,
        closingTime: vendor_detail.closing_time,
      },
    };

    res.status(200).json({
      status: "success",
      message : responseData
    });
  }
  catch(error){
    console.error("Vendor profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const profile_update = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file); // Should log the uploaded file object

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    res.json({ message: "File received", filename: req.file.originalname });
  } catch (error) {
    console.error("Vendor profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { vendor_signup, get_vendor_profile, profile_update };
