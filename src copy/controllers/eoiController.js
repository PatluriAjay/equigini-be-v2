const eoiService = require("../services/eoiService");

// Create a new EOI
exports.createEOI = async (req, res) => {
  try {
    const eoi = await eoiService.createEOI(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: eoi,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all EOIs
exports.getAllEOIs = async (req, res) => {
  try {
    const eois = await eoiService.getAllEOIs();
    // Sort EOIs by creation date (newest first)
    const sortedEOIs = eois.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedEOIs.map(eoi => ({
        ...eoi.toObject(),
        pdf_content: eoi.pdf_content || null
      })),
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
}; 

exports.checkEOIStatus = async (req, res) => {
  try {
    const { investor_id, deal_id } = req.query;

    if (!investor_id || !deal_id) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Investor ID and Deal ID are required"
      });
    }

    const result = await eoiService.checkEOIStatus(investor_id, deal_id);
    
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: result
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all EOIs submitted by a specific investor
exports.getEOIsByInvestor = async (req, res) => {
  try {
    const { investor_id } = req.params;

    if (!investor_id) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Investor ID is required"
      });
    }

    const eois = await eoiService.getEOIsByInvestor(investor_id);
    
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        count: eois.length,
        eois: eois
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