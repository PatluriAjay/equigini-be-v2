const authService = require("../services/authService");

// Unified login for both admin and investor
exports.login = async (req, res) => {
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
    const result = await authService.login(email, password);
    
    res.json({
      result_code: 200,
      status: "S",
      result_info: {
        userAuth: result.userAuth,
        investor: result.investor, // Will be null for admin users
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

// Unified logout for both admin and investor
exports.logout = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Email is required",
      });
    }

    const result = await authService.logout(email);
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