const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";

mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));
db.once("open", () => console.log("✅ Connected to MongoDB", MONGO_URI));

module.exports = mongoose;
