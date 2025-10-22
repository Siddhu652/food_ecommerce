const { Readable } = require("stream");
const bcrypt = require("bcrypt");
const { bucket } = require("../config/firebase");
const { User, Vendor, sequelize } = require("../models");
const { where } = require("sequelize");

const vendor_signup = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // const { error } = vendorSignupSchema.validate(req.body, { abortEarly: false });
    // if (error) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "mandatory required fields check",
    //     errors: error.details.map((err) => err.message),
    //   });
    // }

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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const fileName = `restaurants/${req.file.originalname}`;
    const contentType = req.file.mimetype;
    const fileBuffer = req.file.buffer;

    const hashedPass = await bcrypt.hash(password, 10);

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
      status: "success",
      message: "Vendor registered successfully",
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
  try {
    const userId = req.params.userId;

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
      message: responseData,
    });
  } catch (error) {
    console.error("Vendor profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const profile_update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const vendorId = req.user.id; 
    const {
      user_name,
      phoneNo,
      restaurant_name,
      address,
      city,
      landmark,
      opening_time,
      closing_time,
      latitude,
      longitude,
    } = req.body;

    let restaurant_image_url;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    if (req.file) {
      // let restaurant_image_name = req.file.originalname;
      console.log(bucket.name)

      const vendor = await Vendor.findOne({ where: { user_id: vendorId } });
      if (vendor && vendor.restaurant_image) {
        const oldFilePath = vendor.restaurant_image.replace(
          `https://storage.googleapis.com/${bucket.name}/`,
          ""
        );

        await bucket
          .file(oldFilePath)
          .delete()
          .catch((err) =>
            console.warn("Old file delete warning:", err.message)
          );
      }

      const fileName = `restaurants/${req.file.originalname}`;
      const blob = bucket.file(fileName);
      const stream = Readable.from(req.file.buffer);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: req.file.mimetype },
        public: true,
      });

      await new Promise((resolve, reject) => {
        stream
          .pipe(blobStream)
          .on("finish", () => {
            restaurant_image_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            resolve();
          })
          .on("error", reject);
      });

     

      await User.update(
        { userName: user_name, phoneNumber: phoneNo },
        { where: { id: vendorId }, transaction: t }
      );

      const updateData = {
        restaurant_name,
        address,
        city,
        landmark,
        opening_time,
        closing_time,
        latitude,
        longitude,
      };
      if (restaurant_image_url)
        updateData.restaurant_image = restaurant_image_url;

      await Vendor.update(updateData, {
        where: { user_id: vendorId },
        transaction: t,
      });

      await t.commit();
      res.status(200).json({
        status:"success",
         message: "vendor profile updated successfully" });
    }
  } catch (error) {
    console.error("Vendor profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { vendor_signup, get_vendor_profile, profile_update };
