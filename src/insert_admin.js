require("dotenv").config();
const mongoose = require("./config/dbConfig");
const UserAuth = require("./models/userAuth");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

async function insertAdmin() {
  try {
    // Generate correl_id (10 characters with strings and numbers)
    const correl_id = uuidv4().replace(/-/g, '').substring(0, 10);
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);
    
    // Admin data
    const adminData = {
      correl_id: correl_id,
      name: "Admin User",
      mobile: "9999999999", // You can change this
      email: "admin@equigini.com", // You can change this
      password: hashedPassword,
      role: "admin"
    };

    // Check if admin already exists
    const existingAdmin = await UserAuth.findOne({ 
      $or: [
        { email: adminData.email },
        { mobile: adminData.mobile }
      ]
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Admin Details:", {
        correl_id: existingAdmin.correl_id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        mobile: existingAdmin.mobile,
        role: existingAdmin.role
      });
      return;
    }

    // Insert admin
    const admin = await UserAuth.create(adminData);
    
    console.log("✅ Admin inserted successfully!");
    console.log("Admin Details:", {
      correl_id: admin.correl_id,
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      role: admin.role
    });
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("❌ Error inserting admin:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the script
insertAdmin(); 
