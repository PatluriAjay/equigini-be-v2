const UserAuth = require("../models/userAuth");
const Investor = require("../models/investor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Unified login for both admin and investor
exports.login = async (email, password) => {
  // Find user in userAuth table by email
  const userAuth = await UserAuth.findOne({ email: email });
  if (!userAuth) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, userAuth.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Update last_login_date_time in userAuth table
  await UserAuth.findByIdAndUpdate(
    userAuth._id,
    { last_login_date_time: new Date() },
    { new: true }
  );

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: userAuth._id,
      correl_id: userAuth.correl_id,
      email: userAuth.email,
      name: userAuth.name,
      role: userAuth.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // If user is an investor, get additional investor data
  let investorData = null;
  if (userAuth.role === 'investor') {
    const investor = await Investor.findOne({ email: email });
    if (investor) {
      // Check if investor is active
      if (!investor.is_active) {
        throw new Error("Account is deactivated. Please contact admin.");
      }

      // Check if investor is approved
      if (!investor.is_approved) {
        throw new Error("Your account isn't approved yet.");
      }

      investorData = investor.toObject();
      delete investorData.password; // Remove password from response
    }
  }

  // Return data from userAuth table without password
  const userAuthData = userAuth.toObject();
  delete userAuthData.password;

  return {
    userAuth: userAuthData,
    investor: investorData, // Will be null for admin users
    token: token
  };
};

// Logout for both admin and investor
exports.logout = async (email) => {
  // Find user in userAuth table by email
  const userAuth = await UserAuth.findOne({ email: email });
  if (!userAuth) {
    throw new Error("User not found");
  }

  // Update last_logout_date_time in userAuth table
  const updatedUserAuth = await UserAuth.findByIdAndUpdate(
    userAuth._id,
    { last_logout_date_time: new Date() },
    { new: true }
  );

  // Return updated userAuth data without password
  const userAuthData = updatedUserAuth.toObject();
  delete userAuthData.password;

  return {
    userAuth: userAuthData
  };
}; 