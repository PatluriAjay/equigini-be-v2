const NDA = require("../models/nda");
const Investor = require("../models/investor");
const Deal = require("../models/deal");
const { create_pdf } = require("html-to-pdf-pup");

// Helper function to get logo as base64
const getLogoBase64 = () => {
  const logoPath = require("path").join(__dirname, "../assets/equigini-logo.webp");
  try {
    const logoBuffer = require("fs").readFileSync(logoPath);
    return logoBuffer.toString('base64');
  } catch (error) {
    console.error("Error reading logo file:", error);
    return null;
  }
};

// NDA content template (from frontend)
// Use a function to inject investor name dynamically
const getNDAContent = (investorName) => `
<p>This Non-Disclosure Agreement (“Agreement”) is made on this 19 day of Jun 2025 (“Effective Date”)</p>
<p><strong>BETWEEN</strong></p>
<p><strong>Pantomath Fund Advisors Private Limited</strong>, a company incorporated in India under the Companies Act, 1956 and having its office at 406-408 Keshava Premises, Bandra Kurla Complex, Bandra-East, Mumbai, Maharashtra, India (hereinafter referred to as the <strong>“Disclosing Party”</strong>, which expression shall, unless repugnant to the context or meaning thereof, mean and include its successors and permitted assigns) of the First Part.</p>
<p><strong>AND</strong></p>
<p><strong>${investorName}</strong>, a Limited Partnership incorporated under the laws of United States of America having its headquarters at Mumbai (hereinafter referred to as the <strong>“Receiving Party”</strong>, which expression shall, unless repugnant to the context or meaning thereof, mean and include its directors, promoters, successors and permitted assigns) of the Second Part.</p>
<p>Collectively referred to as "Parties" and, individually a "Party".</p>
<p><strong>WHEREAS:</strong></p>
<ol type="A"><li style='margin-bottom:10px;'>The Parties intend to enter into discussions with each other for a possible investment in Disclosing Party's client.  (hereinafter referred to as the "Purpose").</li>
<li>In order to proceed with the Purpose, the Disclosing Party has agreed to provide certain Confidential Information (hereinafter defined) concerning the Purpose and the Receiving Party has agreed to accept such Confidential Information on a strictly confidential basis and on the terms and conditions set out below.</li></ol>
<p><strong>IN CONSIDERATION</strong> of the Receiving Party having access to the Disclosing Party's Confidential Information and for other good and valuable consideration (the receipt and sufficiency of which is hereby acknowledged), each Party agrees to the following terms and conditions:</p>
<p>1. The term "Confidential Information" for the purpose of this Agreement shall mean any and all information and/or data which is obtained, whether in writing, pictorially, in machine readable form, orally or by observation during their visits, in connection with the Purpose or otherwise, including but not limited to, all tangible information, documents, data, papers, statements, any business/ customer information and trade secrets relating to its business practices in connection with the above mentioned purpose or otherwise, and includes proprietary information.</p>
<p>2. Notwithstanding any other provision of this Agreement, the Parties acknowledge that Confidential Information shall not include any information that:</p>
<ol type="a">
<li style='margin-bottom:10px;'>is or becomes publicly available without breach of this Agreement;</li>
<li style='margin-bottom:10px;'>becomes lawfully available to either Party from a third party free from any confidentiality restriction;</li>
<li style='margin-bottom:10px;'>is required to be disclosed under any relevant law, regulation or order of court, provided the effected Party is given prompt notice of such requirement or such order and (where possible) provided the opportunity to contest it, and the scope of such disclosure is limited to the extent possible; or</li>
<li style='margin-bottom:10px;'>was previously in the possession of the Receiving Party and which was not acquired directly or indirectly from the Disclosing Party as evidenced by written records.</li>
</ol>
<p>3. The Receiving Party shall use the Confidential Information only for the Purpose and not disclose any of the Confidential Information to any third party without the Disclosing Party's prior written consent.</p>
<p>4. The Receiving Party shall hold and keep in strictest confidence any and all Confidential Information and shall treat the Confidential Information with at least the same degree of care and protection as it would treat its own Confidential Information. </p>
<p>5. The Receiving Party shall not copy or reproduce in any way (including without limitation, store in any computer or electronic system) any Confidential Information or any documents containing Confidential Information without the Disclosing Party's prior written consent.</p>
<p>6. The Receiving Party shall immediately upon request by the Disclosing Party deliver to the Disclosing Party all Confidential Information disclosed to the Receiving Party, including all copies (if any) made under clause 4.</p>
<p>7. The Receiving Party shall not use the Confidential Information to procure a commercial advantage over the Disclosing Party. 
<ol type="a"><li>The parties acknowledge that neither party has given consent to enter into an agreement for commercial advantage. Until such time as the parties may agree to enter into such agreement, use of information shall be strictly limited to evaluating confidential information for the Purpose</li></ol></p>
<p>8. The Receiving Party acknowledges that damages are not a sufficient remedy for the Disclosing Party for any breach of any of the Receiving Party's undertakings herein provided and the Receiving Party further acknowledges that the Disclosing Party is entitled to specific performance or injunctive relief (as appropriate) as a remedy for any breach or threatened breach of those undertakings by the Receiving Party, in addition to any other remedies available to the Disclosing Party in law or in equity.</p>
<p>9. The Receiving Party does not acquire any intellectual property rights under this Agreement or through any disclosure hereunder, except the limited right to use such Confidential Information in accordance with the Purpose under this Agreement.  </p>
<p>10. Receiving Party shall not modify or erase the logos, trademarks etc., of Disclosing Party or any third party present on the Confidential Information. Neither party shall use or display the logos, trademarks etc., of the other party in any advertisement, press etc., without the prior written consent of the other party.</p>
<p>11. The receiving party shall not use the confidential data for its own business advantage or the advantage any of its portfolio companies that amounts to loss of profits or loss of business directly or indirectly to the Disclosing Party's client.</p>
<p>12. No failure or delay by either Party in exercising or enforcing any right, remedy or power hereunder shall operate as a waiver thereof, nor shall any single or partial exercise or enforcement of any right, remedy or power preclude any further exercise or enforcement thereof or the exercise or enforcement of any other right, remedy or power.</p>
<p>13. This Agreement shall be governed by the laws of India and subject to the jurisdiction of the courts in Mumbai.</p>
<p>14. This Agreement supersedes all prior discussions and writings with respect to the subject matter hereof, and constitutes the entire agreement between the parties with respect to the subject matter hereof. No waiver or modification of this Agreement will be binding upon either Party unless made in writing and signed by a duly authorized representative of each Party.  </p>
<p>15. In the event that any of the provisions of this Agreement shall be held by a court or other tribunal of competent jurisdiction to be unenforceable, the remaining portions hereof shall remain in full force and effect.</p>
<p>16. Nothing in this Agreement shall preclude either party from engaging in discussions with any third party (ies) regarding the Purpose, provided that the terms of this Agreement are strictly complied with during such discussions.</p>
<p>17. The Receiving Party hereby agrees for itself and any of its related parties, group entities and portfolio companies, to not directly contact and bypass the Disclosing Party and reach out to the Client introduced by the Disclosing Party, directly or indirectly, by or through any other party for the Purpose or any other commercial interest related to the Purpose, without the specific written consent and approval of the Disclosing Party.</p>
<p>18. All obligations respecting the Confidential Information already provided hereunder shall survive for a period of one year (1 year) after the date that the specific Confidential Information was first disclosed.</p>
<p>19. This Agreement is valid for a period of 1 year from the above-mentioned date or till signing of Share Purchase Agreement, whichever is earlier.</p>
<p>20. This Agreement is valid and binding on the successors-in-title and permitted assigns of the respective Parties.</p>
<p>IN WITNESS WHEREOF this Agreement has been executed by the duly authorized representative of each Party on the day and year first above written.</p>
`;

// Helper to generate NDA HTML
const generateNDAHtml = (nda, investor, deal) => {
  const ndaContent = getNDAContent(investor.full_name);
  const logoBase64 = getLogoBase64();
  const logoImg = logoBase64
    ? `<img src="data:image/webp;base64,${logoBase64}" alt="Equigini Logo" style="width: 120px; height: auto; position: absolute; top: 20px; right: 20px;">`
    : '';

  return `
    <html>
      <head>
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            height: 800px; 
            margin: 32px auto; 
            padding: 32px 28px; 
            position: relative; 
            page-break-after: always;
          }
          .container:last-child {
            page-break-after: auto;
          }
          .logo-container { 
            position: absolute; 
            top: 20px; 
            right: 20px; 
          }
          h2 { 
            color: #A330Ae; 
            margin-bottom: 24px; 
            letter-spacing: 0.5px; 
            text-align: center;
          }
          h3 { 
            margin-top: 32px; 
            margin-bottom: 12px; 
            color: #222; 
            font-size: 1.1rem; 
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin-bottom: 8px; 
          }
          th, td { 
            border: 1px solid #e0c6f5; 
            padding: 10px 14px; 
            text-align: left; 
            font-size: 1rem; 
          }
          th { 
            background: #f3eaff; 
            color: #A330Ae; 
            font-weight: 600; 
            width: 30%; 
          }
          td { 
            background: #f9f3fd; 
            color: #222; 
            width: 70%; 
          }
          .section { 
            margin-bottom: 24px; 
          }
          .footer { 
            margin-top: 32px; 
            font-size: 12px; 
            color: #888; 
            text-align: right; 
          }
          .nda-content {
            background: #f9f3fd; 
            border: 1px solid #e0c6f5; 
            padding: 18px; 
            border-radius: 6px; 
            margin-bottom: 12px; 
            font-size: 0.9rem; 
            color: #333;
            height: 500px;
            overflow-y: auto;
          }
        </style>
      </head>
      <body>
        <!-- Page 1: Deal Details -->
        <div class="container">
          ${logoImg}
          <h2>NON-DISCLOSURE AGREEMENT</h2>
          
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
          
          <div class="footer">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <!-- Page 2: Investor Details -->
        <div class="container">
          ${logoImg}
          <h2>NON-DISCLOSURE AGREEMENT</h2>
          
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
          
          <div class="footer">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <!-- Page 3: Agreement Content -->
        <div class="container">
          ${logoImg}
          <h2>NON-DISCLOSURE AGREEMENT</h2>
          
          <div class="section">
            <h3>Agreement Content</h3>
            <div class="nda-content">
              ${ndaContent}
            </div>
          </div>
          
          <div class="footer">Generated on ${new Date().toLocaleString()}</div>
        </div>
      </body>
    </html>
  `;
};


// Sign NDA (create or update NDA agreement)
exports.signNDA = async (ndaData) => {
  try {
    const { investor_id, deal_id } = ndaData;
    // Check if NDA already exists
    let nda = await NDA.findOne({ investor_id: investor_id, deal_id: deal_id });
    if (nda) {
      // Update existing NDA
      nda.investor_name = ndaData.investor_name;
      nda.investor_email = ndaData.investor_email;
      nda.investor_mobile = ndaData.investor_mobile;
      nda.deal_name = ndaData.deal_name;
      nda.nda_signed = ndaData.nda_signed;
      nda.signed_date = ndaData.nda_signed ? new Date() : null;
      nda.created_by = ndaData.created_by;
      await nda.save();
    } else {
      // Create new NDA
      nda = await NDA.create({
        ...ndaData,
        signed_date: ndaData.nda_signed ? new Date() : null
      });
    }
    
    // Fetch investor and deal details
    const investor = await Investor.findById(nda.investor_id);
    const deal = await Deal.findById(nda.deal_id);
    
    // Generate HTML
    const html = generateNDAHtml(nda, investor, deal);
    
    // Generate PDF and convert to base64
    const pdfBuffer = await create_pdf(html);
    const pdfBase64 = pdfBuffer.toString('base64');
    
    // Update NDA with PDF content as base64
    nda.pdf_content = pdfBase64;
    await nda.save();
    
    return nda;
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
      deal_name: nda.deal_name,
      pdf_content: nda.pdf_content || null
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