const dealService = require("../services/dealService");

// Create a new deal
exports.createDeal = async (req, res) => {
  try {
    const deal = await dealService.createDeal(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: deal,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update an existing deal
exports.updateDeal = async (req, res) => {
  try {
    const deal = await dealService.updateDeal(req.params.id, req.body);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deal,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get a single deal by ID
exports.getDealById = async (req, res) => {
  try {
    const deal = await dealService.getDealById(req.params.id);
    if (!deal)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "Deal not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: deal,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get a single deal by slug
exports.getDealBySlug = async (req, res) => {
  try {
    const deal = await dealService.getDealBySlug(req.params.slug);
    if (!deal)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "Deal not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: deal,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all deals
exports.getAllDeals = async (req, res) => {
  try {
    const deals = await dealService.getAllDeals();
    // Sort deals by creation date (newest first)
    const sortedDeals = deals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedDeals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get deals hide private deals

// Delete a deal
exports.deleteDeal = async (req, res) => {
  try {
    await dealService.deleteDeal(req.params.id);
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

// Get deals by sector
exports.getDealsBySector = async (req, res) => {
  try {
    const deals = await dealService.getDealsBySector(req.params.sectorId);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get deals by stage
exports.getDealsByStage = async (req, res) => {
  try {
    const deals = await dealService.getDealsByStage(req.params.stageId);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get deals by geography
exports.getDealsByGeography = async (req, res) => {
  try {
    const deals = await dealService.getDealsByGeography(req.params.geography);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get deals by ticket size
exports.getDealsByTicketSize = async (req, res) => {
  try {
    const deals = await dealService.getDealsByTicketSize(req.params.ticketSizeId);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get deals by status
exports.getDealsByStatus = async (req, res) => {
  try {
    const deals = await dealService.getDealsByStatus(req.params.statusId);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get deals by priority
exports.getDealsByPriority = async (req, res) => {
  try {
    const deals = await dealService.getDealsByPriority(req.params.priority);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get deals by visibility
exports.getDealsByVisibility = async (req, res) => {
  try {
    const deals = await dealService.getDealsByVisibility(req.params.visibility);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Search deals
exports.searchDeals = async (req, res) => {
  try {
    const deals = await dealService.searchDeals(req.query.q);
    res.json({
      result_code: 200,
      status: "S",
      result_info: deals,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
}; 