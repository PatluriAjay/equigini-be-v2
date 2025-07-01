const stageService = require("../services/stageService");

// Create a new stage
exports.createStage = async (req, res) => {
  try {
    const stage = await stageService.createStage(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: stage,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update an existing stage
exports.updateStage = async (req, res) => {
  try {
    const stage = await stageService.updateStage(req.params.id, req.body);
    res.json({
      result_code: 200,
      status: "S",
      result_info: stage,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get a single stage by ID
exports.getStageById = async (req, res) => {
  try {
    const stage = await stageService.getStageById(req.params.id);
    if (!stage)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "Stage not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: stage,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all stages
exports.getAllStages = async (req, res) => {
  try {
    const stages = await stageService.getAllStages();
    // Sort stages by creation date (newest first)
    const sortedStages = stages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedStages,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Delete a stage
exports.deleteStage = async (req, res) => {
  try {
    await stageService.deleteStage(req.params.id);
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
