const mongoose = require("../config/dbConfig");

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  excerpt: { 
    type: String 
  },
  read_time: { 
    type: Number 
  },
  featured_image: {
    filename: { type: String },
    originalname: { type: String },
    path: { type: String },
    mimetype: { type: String },
    size: { type: Number },
  },
  word_document: {
    filename: { type: String },
    originalname: { type: String },
    path: { type: String },
    mimetype: { type: String },
    size: { type: Number },
  },
  created_by: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Blog", blogSchema); 