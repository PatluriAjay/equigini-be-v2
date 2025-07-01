const mongoose = require("../config/dbConfig");

const sectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_by: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
},
  { timestamps: true }
);

module.exports = mongoose.model("Sector", sectorSchema);
