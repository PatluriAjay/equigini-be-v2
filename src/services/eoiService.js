const EOI = require("../models/eoi");
const Investor = require("../models/investor");
const Deal = require("../models/deal");
const { create_pdf } = require("html-to-pdf-pup");
const fs = require("fs");
const path = require("path");

// Helper function to get logo as base64
const getLogoBase64 = () => {
  const logoPath = path.join(__dirname, "../assets/equigini-logo.webp");
  try {
    const logoBuffer = fs.readFileSync(logoPath);
    return logoBuffer.toString('base64');
  } catch (error) {
    console.error("Error reading logo file:", error);
    return null;
  }
};

// Helper to generate EOI HTML
const generateEOIHtml = (eoi, investor, deal) => {
  const logoBase64 = getLogoBase64();
  const logoImg = logoBase64 ? `<img src="data:image/webp;base64,${logoBase64}" alt="Equigini Logo" style="width: 120px; height: auto; position: absolute; top: 20px; right: 20px;">` : '';
  
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; max-height: 800px; margin: 32px auto; padding: 32px 28px; position: relative; }
          .logo-container { position: absolute; top: 20px; right: 20px; }
          h2 { color: #A330Ae; margin-bottom: 24px; letter-spacing: 0.5px; }
          h3 { margin-top: 32px; margin-bottom: 12px; color: #222; font-size: 1.1rem; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 8px; }
          th, td { border: 1px solid #e0c6f5; padding: 10px 14px; text-align: left; font-size: 1rem; }
          th { background: #f3eaff; color: #A330Ae; font-weight: 600; width: 30%; }
          td { background: #f9f3fd; color: #222; width: 70%; }
          .section { margin-bottom: 24px; }
          .footer { margin-top: 32px; font-size: 12px; color: #888; text-align: right; }
        </style>
      </head>
      <body>
        <div class="container">
          ${logoImg}
          <h2>Expression of Interest (EOI) Summary</h2>
          <div class="section">
            <h3>Investor Details</h3>
            <table>
              <tr><th>Name</th><td>${investor.full_name}</td></tr>
              <tr><th>Email</th><td>${investor.email}</td></tr>
              <tr><th>Mobile</th><td>${investor.mobile_number}</td></tr>
              <tr><th>Type</th><td>${investor.investor_type}</td></tr>
              <tr><th>Geography</th><td>${investor.geography}</td></tr>
              <tr><th>Investment Range</th><td>${investor.investment_range}</td></tr>
            </table>
          </div>
          <div class="section">
            <h3>Deal Details</h3>
            <table>
              <tr><th>Title</th><td>${deal.deal_title}</td></tr>
              <tr><th>Sector</th><td>${deal.sector}</td></tr>
              <tr><th>Stage</th><td>${deal.stage}</td></tr>
              <tr><th>Geography</th><td>${deal.geography}</td></tr>
              <tr><th>Ticket Size</th><td>${deal.ticket_size_range}</td></tr>
              <tr><th>Expected IRR</th><td>${deal.expected_irr}</td></tr>
              <tr><th>Timeline</th><td>${deal.timeline}</td></tr>
            </table>
          </div>
          <div class="section">
            <h3>EOI Details</h3>
            <table>
              <tr><th>Intended Ticket Size</th><td>${eoi.intended_ticket_size}</td></tr>
              <tr><th>Comments</th><td>${eoi.comments || "-"}</td></tr>
              <tr><th>Timeline to Invest</th><td>${eoi.timeline_to_invest}</td></tr>
              <tr><th>Preferred Contact Method</th><td>${eoi.preferred_contact_method}</td></tr>
            </table>
          </div>
          <div class="footer">Generated on ${new Date().toLocaleString()}</div>
        </div>
      </body>
    </html>
  `;
};

exports.createEOI = async (eoiData) => {
  // Save EOI first (to get _id for filename)
  const eoi = await EOI.create(eoiData);

  // Fetch investor and deal details
  const investor = await Investor.findById(eoi.investor_id);
  const deal = await Deal.findById(eoi.deal_id);

  // Generate HTML
  const html = generateEOIHtml(eoi, investor, deal);

  // Generate PDF
  const pdfBuffer = await create_pdf(html);
  // Save PDF to disk
  const pdfDir = path.join(__dirname, "../files/eoi");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
  const pdfPath = path.join(pdfDir, `eoi-${eoi._id}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);

  // Update EOI with PDF path (relative)
  eoi.pdf_path = `files/eoi/eoi-${eoi._id}.pdf`;
  await eoi.save();

  return eoi;
};

exports.getAllEOIs = async () => {
  // Return all EOIs including pdf_path
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