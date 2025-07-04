const mongoose = require("../config/dbConfig");

const userAuthSchema = new mongoose.Schema(
  {
    correl_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    last_login_date_time: { type: Date },
    last_logout_date_time: { type: Date },
  },
  { timestamps: true, collection: "user_auth" }
);

module.exports = mongoose.model("user_auth", userAuthSchema);
