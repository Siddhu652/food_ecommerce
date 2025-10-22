const Joi = require("joi");

const vendorSignupSchema = Joi.object({
  user_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "User name is required",
    "string.min": "User name must be at least 3 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email address",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  phoneNo: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be 10 digits",
  }),

  restaurant_name: Joi.string().required().messages({
    "string.empty": "Restaurant name is required",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),

  city: Joi.string().required().messages({
    "string.empty": "City is required",
  }),

  landmark: Joi.string().allow("").optional(),

  license_number: Joi.string().required().messages({
    "string.empty": "License number is required",
  }),
  
  opening_time: Joi.string().required().messages({
    "string.empty": "Opening time is required",
  }),

  closing_time: Joi.string().required().messages({
    "string.empty": "Closing time is required",
  }),

  latitude: Joi.number().required().messages({
    "number.base": "Latitude must be a number",
    "any.required": "Latitude is required",
  }),

  longitude: Joi.number().required().messages({
    "number.base": "Longitude must be a number",
    "any.required": "Longitude is required",
  }),
});



module.exports = { vendorSignupSchema };
