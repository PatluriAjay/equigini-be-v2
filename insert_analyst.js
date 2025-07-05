require("dotenv").config();
const mongoose = require("./src/config/dbConfig");
const UserAuth = require("./src/models/userAuth");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

async function insertAnalyst() {
  try {
    // Generate correl_id (10 characters with strings and numbers)
    const correl_id = uuidv4().replace(/-/g, '').substring(0, 10);
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("analyst123", saltRounds);
    
    // Analyst data
    const analystData = {
      correl_id: correl_id,
      name: "Analyst User",
      mobile: "8888888888", // You can change this
      email: "analyst@equigini.com", // You can change this
      password: hashedPassword,
      role: "analyst"
    };

    // Check if analyst already exists
    const existingAnalyst = await UserAuth.findOne({ 
      $or: [
        { email: analystData.email },
        { mobile: analystData.mobile }
      ]
    });

    if (existingAnalyst) {
      console.log("Analyst already exists!");
      console.log("Analyst Details:", {
        correl_id: existingAnalyst.correl_id,
        name: existingAnalyst.name,
        email: existingAnalyst.email,
        mobile: existingAnalyst.mobile,
        role: existingAnalyst.role
      });
      return;
    }

    // Insert analyst
    const analyst = await UserAuth.create(analystData);
    
    console.log("✅ Analyst inserted successfully!");
    console.log("Analyst Details:", {
      correl_id: analyst.correl_id,
      name: analyst.name,
      email: analyst.email,
      mobile: analyst.mobile,
      role: analyst.role
    });
    console.log("Password: analyst123");
    
  } catch (error) {
    console.error("❌ Error inserting analyst:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the script
insertAnalyst(); 