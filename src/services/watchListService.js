const WatchList = require("../models/watchList");
const Deal = require("../models/deal");

// Save or unsave a deal to investor's watchlist
exports.toggleDealInWatchlist = async (investorId, dealId, createdBy) => {
  try {
    // Check if already in watchlist
    const existingWatchlist = await WatchList.findOne({
      investor_id: investorId,
      deal_id: dealId
    });

    if (existingWatchlist) {
      if (existingWatchlist.is_active) {
        // Remove from watchlist
        existingWatchlist.is_active = false;
        await existingWatchlist.save();
        return { action: "removed", message: "Deal removed from watchlist" };
      } else {
        // Add back to watchlist
        existingWatchlist.is_active = true;
        await existingWatchlist.save();
        return { action: "added", message: "Deal added to watchlist" };
      }
    } else {
      // Add to watchlist for first time
      await WatchList.create({
        investor_id: investorId,
        deal_id: dealId,
        created_by: createdBy
      });
      return { action: "added", message: "Deal added to watchlist" };
    }
  } catch (error) {
    throw error;
  }
};

// Get all saved deals for an investor
exports.getInvestorWatchlist = async (investorId) => {
  try {
    const watchlist = await WatchList.find({
      investor_id: investorId,
      is_active: true
    })
    .sort({ createdAt: -1 });

    return watchlist.map(item => ({
      deal_id: item.deal_id,
      added_date: item.createdAt
    }));
  } catch (error) {
    throw error;
  }
};

// Check if a deal is in investor's watchlist
exports.isDealInWatchlist = async (investorId, dealId) => {
  try {
    const watchlistItem = await WatchList.findOne({
      investor_id: investorId,
      deal_id: dealId,
      is_active: true
    });
    
    return !!watchlistItem;
  } catch (error) {
    throw error;
  }
};

// Get dashboard data for investor (4 saved deals + 4 latest deals)
exports.getInvestorDashboard = async (investorId) => {
  try {
    // Get watchlist items for the investor
    const watchlistItems = await WatchList.find({
      investor_id: investorId,
      is_active: true
    })
    .sort({ createdAt: -1 })
    .limit(4);

    // Extract deal IDs from watchlist
    const savedDealIds = watchlistItems.map(item => item.deal_id);

    // Get saved deals with full details
    const savedDeals = await Deal.find({
      _id: { $in: savedDealIds },
      is_active: true
    })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name')
    .sort({ createdAt: -1 })
    .limit(4);

    // Get 4 latest deals (excluding saved ones)
    const latestDeals = await Deal.find({
      _id: { $nin: savedDealIds },
      is_active: true
    })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name')
    .sort({ createdAt: -1 })
    .limit(4);

    return {
      saved_deals: savedDeals,
      latest_deals: latestDeals,
      saved_count: savedDeals.length,
      latest_count: latestDeals.length
    };
  } catch (error) {
    throw error;
  }
}; 