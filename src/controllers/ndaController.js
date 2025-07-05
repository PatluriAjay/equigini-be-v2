const ndaService = require("../services/ndaService");

// Sign NDA (create or update NDA agreement)
exports.signNDA = async (req, res) => {
  try {
    const {
      investor_id,
      investor_name,
      investor_email,
      investor_mobile,
      deal_id,
      deal_name,
      nda_signed,
      created_by
    } = req.body;

    // Validate required fields
    if (!investor_id || !investor_name || !investor_email || !investor_mobile || !deal_id || !deal_name) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "All investor and deal information is required"
      });
    }

    const ndaData = {
      investor_id,
      investor_name,
      investor_email,
      investor_mobile,
      deal_id,
      deal_name,
      nda_signed: nda_signed || false,
      created_by: created_by || 1
    };

    const result = await ndaService.signNDA(ndaData);
    
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        message: nda_signed ? "NDA signed successfully" : "NDA agreement updated",
        nda_agreement: {
          ...result.toObject(),
          pdf_content: result.pdf_content || null
        }
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

// Check if NDA is signed for a specific deal
exports.isNDASigned = async (req, res) => {
  try {
    const { investor_id, deal_id } = req.query;

    if (!investor_id || !deal_id) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Investor ID and Deal ID are required"
      });
    }

    const result = await ndaService.isNDASigned(investor_id, deal_id);
    
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

// Get all NDA agreements for admin
exports.getAllNDAAgreements = async (req, res) => {
  try {
    const ndaAgreements = await ndaService.getAllNDAAgreements();
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        count: ndaAgreements.length,
        agreements: ndaAgreements.map(nda => ({
          ...nda.toObject(),
          pdf_content: nda.pdf_content || null
        }))
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

// Get only signed NDA agreements
exports.getAllSignedNDAs = async (req, res) => {
  try {
    const signedNDAs = await ndaService.getAllSignedNDAs();
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: {
        count: signedNDAs.length,
        signed_agreements: signedNDAs.map(nda => ({
          ...nda.toObject(),
          pdf_content: nda.pdf_content || null
        }))
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