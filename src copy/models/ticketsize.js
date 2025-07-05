const mongoose = require("../config/dbConfig");

const ticketsizeSchema = new mongoose.Schema({
  ticket_min: { type: String, required: true },
  ticket_max: { type: String, required: true },
  created_by: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
},
  { timestamps: true }
);

module.exports = mongoose.model("TicketSize", ticketsizeSchema);
