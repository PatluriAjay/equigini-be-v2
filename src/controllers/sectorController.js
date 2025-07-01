const sectorService = require("../services/sectorService");

// Create a new sector
exports.createSector = async (req, res) => {
  try {
    const sector = await sectorService.createSector(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: sector,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update an existing sector
exports.updateSector = async (req, res) => {
  try {
    const sector = await sectorService.updateSector(req.params.id, req.body);
    res.json({
      result_code: 200,
      status: "S",
      result_info: sector,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get a single sector by ID
exports.getSectorById = async (req, res) => {
  try {
    const sector = await sectorService.getSectorById(req.params.id);
    if (!sector)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "Sector not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: sector,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all sectors
exports.getAllSectors = async (req, res) => {
  try {
    const sectors = await sectorService.getAllSectors();
    // Sort sectors by creation date (newest first)
    const sortedSectors = sectors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedSectors,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Delete a sector
exports.deleteSector = async (req, res) => {
  try {
    await sectorService.deleteSector(req.params.id);
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
