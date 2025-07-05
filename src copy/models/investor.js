const mongoose = require("../config/dbConfig");

const investorSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pan_number: { type: String, unique: true },
  investor_type: { type: String, required: true },
  geography: { type: String, },
  investment_range: { type: String, },
  preferred_sectors: [{ type: String }],
  source_of_discovery: { type: String, },
  address1: { type: String },
  city: { type: String },
  state: { type: String },
  postal_code: { type: String },
  country: { type: String },
  is_active: { type: Boolean, default: true },
  is_approved: { type: Boolean, default: false },
  rejection_reason: { type: String },
  correl_id: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investor_Master", investorSchema);