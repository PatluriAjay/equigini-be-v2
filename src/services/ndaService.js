const NDA = require("../models/nda");

// Sign NDA (create or update NDA agreement)
exports.signNDA = async (ndaData) => {
  try {
    const { investor_id, deal_id } = ndaData;
    
    // Check if NDA already exists
    const existingNDA = await NDA.findOne({
      investor_id: investor_id,
      deal_id: deal_id
    });

    if (existingNDA) {
      // Update existing NDA
      existingNDA.investor_name = ndaData.investor_name;
      existingNDA.investor_email = ndaData.investor_email;
      existingNDA.investor_mobile = ndaData.investor_mobile;
      existingNDA.deal_name = ndaData.deal_name;
      existingNDA.nda_signed = ndaData.nda_signed;
      existingNDA.signed_date = ndaData.nda_signed ? new Date() : null;
      existingNDA.created_by = ndaData.created_by;
      
      return await existingNDA.save();
    } else {
      // Create new NDA
      const newNDA = {
        ...ndaData,
        signed_date: ndaData.nda_signed ? new Date() : null
      };
      
      return await NDA.create(newNDA);
    }
  } catch (error) {
    throw error;
  }
};

// Check if NDA is signed for a specific deal
exports.isNDASigned = async (investorId, dealId) => {
  try {
    const nda = await NDA.findOne({
      investor_id: investorId,
      deal_id: dealId,
      is_active: true
    });
    
    if (!nda) {
      return {
        is_signed: false,
        message: "No NDA agreement found"
      };
    }
    
    return {
      is_signed: nda.nda_signed,
      signed_date: nda.signed_date,
      investor_name: nda.investor_name,
      deal_name: nda.deal_name
    };
  } catch (error) {
    throw error;
  }
};

// Get all NDA agreements for admin
exports.getAllNDAAgreements = async () => {
  try {
    const ndaAgreements = await NDA.find({ is_active: true })
      .sort({ createdAt: -1 });
    
    return ndaAgreements;
  } catch (error) {
    throw error;
  }
};

// Get only signed NDA agreements
exports.getAllSignedNDAs = async () => {
  try {
    const signedNDAs = await NDA.find({ 
      is_active: true,
      nda_signed: true 
    }).sort({ signed_date: -1 });
    
    return signedNDAs;
  } catch (error) {
    throw error;
  }
}; 