const {where} = require('sequelize');
const {User, Vendor} = require('../models');

const bcrypt = require('bcrypt');

const vendor_signup = async (req, res) => {
try {
    const {
  user_name, password, email, phoneNo,
  restaurant_name, license_number, address,
  city, landmark, restaurant_image,
  opening_time, closing_time, latitude, longitude
} = req.body;

 if (!email || !password || !restaurant_name) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPass = await bcrypt.hash(password,10);
    const add_user_vendor = await User.create({
        userName:user_name,
        email:email,
        password:hashedPass,
        phoneNumber:phoneNo,
        role:'vendor'
    })

    const add_vendor_detail = await Vendor.create({
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
      status: 'pending'
    });

    res.status(201).json({
        message:"success",
        add_user_vendor,add_vendor_detail
    })
} catch (error) {
    res.status(500).json({
        error: error.message
    })
}
    
}

module.exports = {vendor_signup};