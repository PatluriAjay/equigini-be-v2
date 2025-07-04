const Investor = require("../models/investor");
const UserAuth = require("../models/userAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.createInvestor = async (investorData) => {
  // Check for duplicate email in both tables
  const existingEmailInvestor = await Investor.findOne({ email: investorData.email });
  const existingEmailUserAuth = await UserAuth.findOne({ email: investorData.email });
  if (existingEmailInvestor || existingEmailUserAuth) {
    throw new Error("Email already exists");
  }

  // Check for duplicate mobile number in both tables
  const existingMobileInvestor = await Investor.findOne({ mobile_number: investorData.mobile_number });
  const existingMobileUserAuth = await UserAuth.findOne({ mobile: investorData.mobile_number });
  if (existingMobileInvestor || existingMobileUserAuth) {
    throw new Error("Mobile number already exists");
  }

  // Check for duplicate PAN number (if provided)
  if (investorData.pan_number) {
    const existingPAN = await Investor.findOne({ pan_number: investorData.pan_number });
    if (existingPAN) {
      throw new Error("PAN number already exists");
    }
  }

  // Generate correl_id (10 characters with strings and numbers)
  const correl_id = uuidv4().replace(/-/g, '').substring(0, 10);

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(investorData.password, saltRounds);
  
  // Prepare data for userAuth table
  const userAuthData = {
    correl_id: correl_id,
    name: investorData.full_name,
    mobile: investorData.mobile_number,
    email: investorData.email,
    password: hashedPassword,
    role: "investor" 
  };

  // Prepare data for investor table
  const investorDataWithHashedPassword = {
    ...investorData,
    correl_id: correl_id,
    password: hashedPassword
  };

  try {
    // Create both records
    const userAuth = await UserAuth.create(userAuthData);
    const investor = await Investor.create(investorDataWithHashedPassword);

    return {
      userAuth: userAuth,
      investor: investor
    };
  } catch (error) {
    // If either creation fails, try to clean up the other record
    if (error.code === 11000) {
      // Duplicate key error
      throw new Error("Email or mobile number already exists");
    }
    throw error;
  }
};

exports.updateInvestor = async (id, investorData) => {
  // Check for duplicate email (excluding current investor)
  if (investorData.email) {
    const existingEmail = await Investor.findOne({ 
      email: investorData.email, 
      _id: { $ne: id } 
    });
    if (existingEmail) {
      throw new Error("Email already exists");
    }
  }

  // Check for duplicate mobile number (excluding current investor)
  if (investorData.mobile_number) {
    const existingMobile = await Investor.findOne({ 
      mobile_number: investorData.mobile_number, 
      _id: { $ne: id } 
    });
    if (existingMobile) {
      throw new Error("Mobile number already exists");
    }
  }

  // Check for duplicate PAN number (excluding current investor)
  if (investorData.pan_number) {
    const existingPAN = await Investor.findOne({ 
      pan_number: investorData.pan_number, 
      _id: { $ne: id } 
    });
    if (existingPAN) {
      throw new Error("PAN number already exists");
    }
  }

  // Hash password if it's being updated
  if (investorData.password) {
    const saltRounds = 10;
    investorData.password = await bcrypt.hash(investorData.password, saltRounds);
  }

  const investor = await Investor.findByIdAndUpdate(id, investorData, { new: true });
  if (!investor) throw new Error("Investor not found");
  return investor;
};

exports.getInvestorById = async (id) => {
  return await Investor.findById(id);
};

exports.getAllInvestors = async () => {
  return await Investor.find();
};

exports.deleteInvestor = async (id) => {
  const investor = await Investor.findByIdAndDelete(id);
  if (!investor) throw new Error("Investor not found");
};

exports.getInvestorsByType = async (investor_type) => {
  return await Investor.find({ investor_type });
};

exports.getInvestorsByGeography = async (geography) => {
  return await Investor.find({ geography });
};

exports.getInvestorsBySector = async (sector) => {
  return await Investor.find({ preferred_sectors: sector });
};

// Get pending investors (not approved)
exports.getPendingInvestors = async () => {
  return await Investor.find({ is_approved: false });
};

// Approve investor by admin
exports.approveInvestor = async (id) => {
  const investor = await Investor.findByIdAndUpdate(
    id, 
    { is_approved: true }, 
    { new: true }
  );
  if (!investor) throw new Error("Investor not found");
  return investor;
};


// Reject investor by admin
exports.rejectInvestor = async (id, rejection_reason = null) => {
  const updateData = { 
    is_approved: false,
    is_active: false // Deactivate the account when rejected
  };
  
  // Add rejection reason if provided
  if (rejection_reason) {
    updateData.rejection_reason = rejection_reason;
  }
  
  const investor = await Investor.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true }
  );
  if (!investor) throw new Error("Investor not found");
  return investor;
};

// Get approved investors only
exports.getApprovedInvestors = async () => {
  return await Investor.find({ is_approved: true });
};

// Login investor
exports.loginInvestor = async (email, password) => {
  // Find user in userAuth table by email
  const userAuth = await UserAuth.findOne({ email: email });
  if (!userAuth) {
    throw new Error("Invalid email or password");
  }

  // Find investor by email
  const investor = await Investor.findOne({ email: email });
  if (!investor) {
    throw new Error("Invalid email or password");
  }

  // Check if investor is active
  if (!investor.is_active) {
    throw new Error("Account is deactivated. Please contact admin.");
  }

  // Check if investor is approved
  if (!investor.is_approved) {
    throw new Error("Your account isn't approved yet. Please wait.");
  }

  // Compare password (check against userAuth password)
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
      id: investor._id,
      correl_id: userAuth.correl_id,
      email: investor.email,
      full_name: investor.full_name,
      investor_type: investor.investor_type,
      role: userAuth.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // Return data from both tables without passwords
  const userAuthData = userAuth.toObject();
  const investorData = investor.toObject();
  delete userAuthData.password;
  delete investorData.password;

  return {
    userAuth: userAuthData,
    investor: investorData,
    token: token
  };
};

// Logout investor
exports.logoutInvestor = async (email) => {
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