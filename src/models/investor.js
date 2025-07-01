const mongoose = require("../config/dbConfig");

const investorSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pan_number: { type: String, unique: true },
  investor_type: { type: String, required: true },
  geography: { type: String, required: true },
  investment_range: { type: String, required: true },
  preferred_sectors: [{ type: String }],
  source_of_discovery: { type: String, required: true },
  address1: { type: String },
  city: { type: String },
  state: { type: String },
  postal_code: { type: String },
  country: { type: String },
  // created_by: { type: Number, required: true },
  // created_date: { type: Date, default: Date.now },
  // modified_date: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  is_approved: { type: Boolean, default: false },
  rejection_reason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investor_Master", investorSchema);