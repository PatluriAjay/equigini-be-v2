const Investor = require("../models/investor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createInvestor = async (investorData) => {
  // Check for duplicate email
  const existingEmail = await Investor.findOne({ email: investorData.email });
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // Check for duplicate mobile number
  const existingMobile = await Investor.findOne({ mobile_number: investorData.mobile_number });
  if (existingMobile) {
    throw new Error("Mobile number already exists");
  }

  // Check for duplicate PAN number (if provided)
  if (investorData.pan_number) {
    const existingPAN = await Investor.findOne({ pan_number: investorData.pan_number });
    if (existingPAN) {
      throw new Error("PAN number already exists");
    }
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(investorData.password, saltRounds);
  
  // Replace the plain password with hashed password
  const investorDataWithHashedPassword = {
    ...investorData,
    password: hashedPassword
  };

  return await Investor.create(investorDataWithHashedPassword);
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
  // Find investor by email
  const investor = await Investor.findOne({ email: email });
  if (!investor) {
    throw new Error("Invalid email or password");
  }

  // Check if investor is active
  if (!investor.is_active) {
    throw new Error("Account is deactivated. Please contact admin.");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, investor.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: investor._id, 
      email: investor.email,
      full_name: investor.full_name,
      investor_type: investor.investor_type
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // Return investor data without password and token
  const investorData = investor.toObject();
  delete investorData.password;

  return {
    investor: investorData,
    token: token
  };
}; 