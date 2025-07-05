const statusService = require("../services/statusService");

// Create a new status
exports.createStatus = async (req, res) => {
  try {
    const status = await statusService.createStatus(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: status,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update an existing status
exports.updateStatus = async (req, res) => {
  try {
    const status = await statusService.updateStatus(req.params.id, req.body);
    res.json({
      result_code: 200,
      status: "S",
      result_info: status,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get a single status by ID
exports.getStatusById = async (req, res) => {
  try {
    const status = await statusService.getStatusById(req.params.id);
    if (!status)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "Status not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: status,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all statuses
exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await statusService.getAllStatuses();
    // Sort statuses by creation date (newest first)
    const sortedStatuses = statuses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedStatuses,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Delete a status
exports.deleteStatus = async (req, res) => {
  try {
    await statusService.deleteStatus(req.params.id);
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
