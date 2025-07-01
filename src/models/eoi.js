const mongoose = require("../config/dbConfig");

const eoiSchema = new mongoose.Schema({
  deal_title: { type: String, required: true },
  deal_id: { type: String, required: true },
  investor_name: { type: String, required: true },
  investor_mobile: { type: String, required: true },
  investor_id: { type: String, required: true },
  intended_ticket_size: { type: String, required: true },
  comments: { type: String,  },
  timeline_to_invest: { type: String, required: true },
  preferred_contact_method: { type: String, required: true },
  created_by: { type: Number, required: true },
  is_approved: { type: Boolean, default: false },
},
  { timestamps: true }
);

module.exports = mongoose.model("EOI", eoiSchema); 