const investorService = require("../services/investorService");

// Create a new investor
exports.createInvestor = async (req, res) => {
  try {
    const result = await investorService.createInvestor(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        userAuth: result.userAuth,
        investor: result.investor
      },
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update an existing investor
exports.updateInvestor = async (req, res) => {
  try {
    const investor = await investorService.updateInvestor(req.params.id, req.body);
    res.json({
      result_code: 200,
      status: "S",
      result_info: investor,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get a single investor by ID
exports.getInvestorById = async (req, res) => {
  try {
    const investor = await investorService.getInvestorById(req.params.id);
    if (!investor)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "Investor not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: investor,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all investors
exports.getAllInvestors = async (req, res) => {
  try {
    const investors = await investorService.getAllInvestors();
    // Sort investors by creation date (newest first)
    const sortedInvestors = investors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedInvestors,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Delete an investor
exports.deleteInvestor = async (req, res) => {
  try {
    await investorService.deleteInvestor(req.params.id);
    res.json({
      result_code: 200,
      status: "S",
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get investors by type
exports.getInvestorsByType = async (req, res) => {
  try {
    const investors = await investorService.getInvestorsByType(req.params.type);
    res.json({
      result_code: 200,
      status: "S",
      result_info: investors,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get investors by geography
exports.getInvestorsByGeography = async (req, res) => {
  try {
    const investors = await investorService.getInvestorsByGeography(req.params.geography);
    res.json({
      result_code: 200,
      status: "S",
      result_info: investors,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get investors by preferred sector
exports.getInvestorsBySector = async (req, res) => {
  try {
    const investors = await investorService.getInvestorsBySector(req.params.sector);
    res.json({
      result_code: 200,
      status: "S",
      result_info: investors,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get pending investors (not approved)
exports.getPendingInvestors = async (req, res) => {
  try {
    const investors = await investorService.getPendingInvestors();
    // Sort investors by creation date (newest first)
    const sortedInvestors = investors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedInvestors,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Approve investor by admin
exports.approveInvestor = async (req, res) => {
  try {
    const investor = await investorService.approveInvestor(req.params.id);
    res.json({
      result_code: 200,
      status: "S",
      result_info: investor,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Reject investor by admin
exports.rejectInvestor = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    const investor = await investorService.rejectInvestor(req.params.id, rejection_reason);
    res.json({
      result_code: 200,
      status: "S",
      result_info: investor,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get approved investors only
exports.getApprovedInvestors = async (req, res) => {
  try {
    const investors = await investorService.getApprovedInvestors();
    // Sort investors by creation date (newest first)
    const sortedInvestors = investors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedInvestors,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Login investor
exports.loginInvestor = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Email and password are required",
      });
    }

    // Delegate to service for authentication and token generation
    const result = await investorService.loginInvestor(email, password);
    res.json({
      result_code: 200,
      status: "S",
      result_info: {
        userAuth: result.userAuth,
        investor: result.investor,
        token: result.token
      },
    });
  } catch (err) {
    res.status(401).json({
      result_code: 401,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Logout investor
exports.logoutInvestor = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Email is required",
      });
    }

    const result = await investorService.logoutInvestor(email);
    res.json({
      result_code: 200,
      status: "S",
      result_info: {
        userAuth: result.userAuth
      },
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
}; 