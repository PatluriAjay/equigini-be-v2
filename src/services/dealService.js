const Deal = require("../models/deal");
const NDA = require("../models/nda");
const EOI = require("../models/eoi");

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// Helper function to generate unique slug
const generateUniqueSlug = async (title, existingId = null) => {
  let slug = generateSlug(title);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const query = { slug: uniqueSlug };
    if (existingId) {
      query._id = { $ne: existingId };
    }
    
    const existingDeal = await Deal.findOne(query);
    if (!existingDeal) {
      break;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

exports.createDeal = async (dealData) => {
  // Generate unique slug if not provided
  if (!dealData.slug) {
    dealData.slug = await generateUniqueSlug(dealData.deal_title);
  } else {
    // Check if provided slug is unique
    const existingDeal = await Deal.findOne({ slug: dealData.slug });
    if (existingDeal) {
      throw new Error("Slug already exists");
    }
  }
  
  return await Deal.create(dealData);
};

exports.updateDeal = async (id, dealData) => {
  // Generate unique slug if deal_title is being updated
  if (dealData.deal_title && !dealData.slug) {
    dealData.slug = await generateUniqueSlug(dealData.deal_title, id);
  } else if (dealData.slug) {
    // Check if provided slug is unique (excluding current deal)
    const existingDeal = await Deal.findOne({ slug: dealData.slug, _id: { $ne: id } });
    if (existingDeal) {
      throw new Error("Slug already exists");
    }
  }

  const deal = await Deal.findByIdAndUpdate(id, dealData, { new: true });
  if (!deal) throw new Error("Deal not found");
  return deal;
};

exports.getDealById = async (id) => {
  const deal = await Deal.findById(id)
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');

  if (!deal) {
    return null;
  }

  // Get NDA agreements for this deal
  const ndaAgreements = await NDA.find({ 
    deal_id: deal._id.toString(),
    is_active: true 
  }).select('investor_name investor_email investor_mobile nda_signed signed_date pdf_path');

  // Get EOI submissions for this deal
  const eoiSubmissions = await EOI.find({ 
    deal_id: deal._id.toString(),
    is_approved: true 
  }).select('investor_name investor_mobile intended_ticket_size timeline_to_invest preferred_contact_method pdf_path createdAt');

  // Add the related documents to the deal object
  const dealWithDocuments = deal.toObject();
  dealWithDocuments.nda_agreements = ndaAgreements;
  dealWithDocuments.eoi_submissions = eoiSubmissions;
  dealWithDocuments.nda_count = ndaAgreements.length;
  dealWithDocuments.eoi_count = eoiSubmissions.length;

  return dealWithDocuments;
};

// New method to get deal by slug
exports.getDealBySlug = async (slug) => {
  const deal = await Deal.findOne({ slug })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');

  if (!deal) {
    return null;
  }

  // Get NDA agreements for this deal
  const ndaAgreements = await NDA.find({ 
    deal_id: deal._id.toString(),
    is_active: true 
  }).select('investor_name investor_email investor_mobile nda_signed signed_date pdf_path');

  // Get EOI submissions for this deal
  const eoiSubmissions = await EOI.find({ 
    deal_id: deal._id.toString(),
    is_approved: true 
  }).select('investor_name investor_mobile intended_ticket_size timeline_to_invest preferred_contact_method pdf_path createdAt');

  // Add the related documents to the deal object
  const dealWithDocuments = deal.toObject();
  dealWithDocuments.nda_agreements = ndaAgreements;
  dealWithDocuments.eoi_submissions = eoiSubmissions;
  dealWithDocuments.nda_count = ndaAgreements.length;
  dealWithDocuments.eoi_count = eoiSubmissions.length;

  return dealWithDocuments;
};

exports.getAllDeals = async () => {
  return await Deal.find()
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.deleteDeal = async (id) => {
  const deal = await Deal.findByIdAndDelete(id);
  if (!deal) throw new Error("Deal not found");
};

exports.getDealsBySector = async (sectorId) => {
  return await Deal.find({ sector: sectorId })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.getDealsByStage = async (stageId) => {
  return await Deal.find({ stage: stageId })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.getDealsByGeography = async (geography) => {
  return await Deal.find({ geography })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.getDealsByTicketSize = async (ticketSizeId) => {
  return await Deal.find({ ticket_size_range: ticketSizeId })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.getDealsByStatus = async (statusId) => {
  return await Deal.find({ status: statusId })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.getDealsByPriority = async (priority) => {
  return await Deal.find({ deal_priority: priority })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.getDealsByVisibility = async (visibility) => {
  return await Deal.find({ visibility })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
};

exports.searchDeals = async (searchTerm) => {
  return await Deal.find({
    $or: [
      { deal_title: { $regex: searchTerm, $options: 'i' } },
      { slug: { $regex: searchTerm, $options: 'i' } },
      { summary: { $regex: searchTerm, $options: 'i' } },
      { full_description: { $regex: searchTerm, $options: 'i' } },
      { geography: { $regex: searchTerm, $options: 'i' } }
    ]
  })
    .populate('sector', 'name')
    .populate('stage', 'name')
    .populate('ticket_size_range', 'name')
    .populate('status', 'name');
}; 