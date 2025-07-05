const mongoose = require("../config/dbConfig");

const ndaSchema = new mongoose.Schema({
  investor_id: { 
    type: String, 
    required: true 
  },
  investor_name: { 
    type: String, 
    required: true 
  },
  investor_email: { 
    type: String, 
    required: true 
  },
  investor_mobile: { 
    type: String, 
    required: true 
  },
  deal_id: { 
    type: String, 
    required: true 
  },
  deal_name: { 
    type: String, 
    required: true 
  },
  nda_signed: { 
    type: Boolean, 
    default: false 
  },
  signed_date: { 
    type: Date 
  },
  created_by: { 
    type: Number, 
    required: true 
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  pdf_path: { type: String },
}, { 
  timestamps: true 
});

// Compound index to ensure unique investor-deal combinations
ndaSchema.index({ investor_id: 1, deal_id: 1 }, { unique: true });

module.exports = mongoose.model("NDA", ndaSchema); 