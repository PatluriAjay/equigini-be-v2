const mongoose = require("../config/dbConfig");

const dealSchema = new mongoose.Schema(
  {
    deal_title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sector: { type: String, required: true },
    stage: { type: String, required: true },
    geography: { type: String, required: true },
    ticket_size_range: { type: String, required: true },
    expected_irr: { type: String, required: true },
    timeline: { type: String, required: true },
    summary: { type: String, required: true },
    full_description: { type: String, required: true },
    status: { type: String, required: true },
    deal_priority: { type: String, required: true },
    visibility: {
      type: String,
    },
    teaser_document: {
      filename: { type: String },
      originalname: { type: String },
      path: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
    deal_collateral: {
      pitch: {
        filename: { type: String },
        originalname: { type: String },
        path: { type: String },
        mimetype: { type: String },
        size: { type: Number },
      },
      deck: {
        filename: { type: String },
        originalname: { type: String },
        path: { type: String },
        mimetype: { type: String },
        size: { type: Number },
      },
      im: {
        filename: { type: String },
        originalname: { type: String },
        path: { type: String },
        mimetype: { type: String },
        size: { type: Number },
      },
      financials: {
        filename: { type: String },
        originalname: { type: String },
        path: { type: String },
        mimetype: { type: String },
        size: { type: Number },
      },
    },
    image: {
      filename: { type: String },
      originalname: { type: String },
      path: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
    deal_icon: {
      filename: { type: String },
      originalname: { type: String },
      path: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
  
    created_by: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
