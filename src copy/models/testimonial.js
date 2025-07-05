const mongoose = require("../config/dbConfig");

const testimonialSchema = new mongoose.Schema({
  user_img: { type: String, required: true },
  user_name: { type: String, required: true },
  investor_type: { type: String, required: true },
  message: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema); 