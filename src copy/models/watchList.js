const mongoose = require("../config/dbConfig");

const watchListSchema = new mongoose.Schema({
  investor_id: { 
    type: String, 
    required: true 
  },
  deal_id: { 
    type: String, 
    required: true 
  },
  is_active: { type: Boolean, default: true },
  created_by: { type: Number, required: true },
}, { 
  timestamps: true 
});

// Compound index to ensure unique investor-deal combinations
watchListSchema.index({ investor_id: 1, deal_id: 1 }, { unique: true });

module.exports = mongoose.model("WatchList", watchListSchema); 