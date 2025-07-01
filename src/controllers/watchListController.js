const watchListService = require("../services/watchListService");

// Save or unsave a deal to investor's watchlist
exports.toggleDealInWatchlist = async (req, res) => {
  try {
    const { investor_id, deal_id } = req.body;
    const created_by = req.body.created_by || 1; // Default to 1 if not provided

    if (!investor_id || !deal_id) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Investor ID and Deal ID are required"
      });
    }

    const result = await watchListService.toggleDealInWatchlist(investor_id, deal_id, created_by);
    
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        message: result.message,
        action: result.action
      }
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all saved deals for an investor
exports.getInvestorWatchlist = async (req, res) => {
  try {
    const { investor_id } = req.params;

    if (!investor_id) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Investor ID is required"
      });
    }

    const watchlist = await watchListService.getInvestorWatchlist(investor_id);
    
    // Sort watchlist by creation date (newest first)
    const sortedWatchlist = watchlist.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        count: sortedWatchlist.length,
        deals: sortedWatchlist
      }
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Check if a deal is in investor's watchlist
exports.isDealInWatchlist = async (req, res) => {
  try {
    const { investor_id, deal_id } = req.query;

    if (!investor_id || !deal_id) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Investor ID and Deal ID are required"
      });
    }

    const isInWatchlist = await watchListService.isDealInWatchlist(investor_id, deal_id);
    
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        investor_id: investor_id,
        deal_id: deal_id,
        is_in_watchlist: isInWatchlist
      }
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get investor dashboard data (4 saved deals + 4 latest deals)
exports.getInvestorDashboard = async (req, res) => {
  try {
    const { investor_id } = req.params;

    if (!investor_id) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Investor ID is required"
      });
    }

    const dashboardData = await watchListService.getInvestorDashboard(investor_id);
    
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        investor_id: investor_id,
        saved_deals: dashboardData.saved_deals,
        latest_deals: dashboardData.latest_deals,
        saved_count: dashboardData.saved_count,
        latest_count: dashboardData.latest_count,
        total_deals: dashboardData.saved_count + dashboardData.latest_count
      }
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
}; 