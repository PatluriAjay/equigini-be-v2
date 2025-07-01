const EOI = require("../models/eoi");

exports.createEOI = async (eoiData) => {
  return await EOI.create(eoiData);
};

exports.getAllEOIs = async () => {
  return await EOI.find();
}; 

exports.checkEOIStatus = async (investorId, dealId) => {
  const eoi = await EOI.findOne({ investor_id: investorId, deal_id: dealId });
  return {
    exists: !!eoi,
    submitted: !!eoi,
    eoi_data: eoi || null
  };
};

// Get all EOIs submitted by a specific investor
exports.getEOIsByInvestor = async (investorId) => {
  try {
    const eois = await EOI.find({ investor_id: investorId })
      .sort({ createdAt: -1 }); // Most recent first
    
    return eois;
  } catch (error) {
    throw error;
  }
}; 