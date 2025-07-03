require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use('/files', express.static(path.join(__dirname, 'files')));

// Middleware
const { handleFileUpload } = require("./middleware/fileUpload");
const { handleMultipleBlogFiles } = require("./middleware/blogFileUpload");
const { handleTestimonialImageUpload } = require("./middleware/testimonialFileUpload");

// Controllers
const sectorController = require("./controllers/sectorController");
const stageController = require("./controllers/stageController");
const statusController = require("./controllers/statusController");
const ticketsizeController = require("./controllers/ticketsizeController");
const investorController = require("./controllers/investorController");
const dealController = require("./controllers/dealController");
const eoiController = require("./controllers/eoiController");
const watchListController = require("./controllers/watchListController");
const ndaController = require("./controllers/ndaController");
const blogController = require("./controllers/blogController");
const testimonialController = require("./controllers/testimonialController");
const publicHomeController = require("./controllers/publicHomeController");

// Sector endpoints
app.post("/api/createSector", sectorController.createSector);
app.get("/api/getSectorInfo/:id", sectorController.getSectorById);
app.get("/api/getAllSectors", sectorController.getAllSectors);
app.put("/api/updateSector/:id", sectorController.updateSector);
app.delete("/api/deleteSector/:id", sectorController.deleteSector);

// Stage endpoints
app.post("/api/createStage", stageController.createStage);
app.get("/api/getStageInfo/:id", stageController.getStageById);
app.get("/api/getAllStages", stageController.getAllStages);
app.put("/api/updateStage/:id", stageController.updateStage);
app.delete("/api/deleteStage/:id", stageController.deleteStage);

// Status endpoints
app.post("/api/createStatus", statusController.createStatus);
app.get("/api/getAllStatuses", statusController.getAllStatuses);
app.get("/api/getStatusInfo/:id", statusController.getStatusById);
app.put("/api/updateStatus/:id", statusController.updateStatus);
app.delete("/api/deleteStatus/:id", statusController.deleteStatus);

// TicketSize endpoints
app.post("/api/createTicketSize", ticketsizeController.createTicketSize);
app.get("/api/getAllTicketSizes", ticketsizeController.getAllTicketSizes);
app.get("/api/getTicketSizeInfo/:id", ticketsizeController.getTicketSizeById);
app.put("/api/updateTicketSize/:id", ticketsizeController.updateTicketSize);
app.delete("/api/deleteTicketSize/:id", ticketsizeController.deleteTicketSize);

// Investor endpoints
app.post("/api/createInvestor", investorController.createInvestor);
app.post("/api/loginInvestor", investorController.loginInvestor);
app.get("/api/getInvestorInfo/:id", investorController.getInvestorById);
app.get("/api/getAllInvestors", investorController.getAllInvestors);
app.put("/api/updateInvestor/:id", investorController.updateInvestor);
app.delete("/api/deleteInvestor/:id", investorController.deleteInvestor);
app.get("/api/getInvestorsByType/:type", investorController.getInvestorsByType);
app.get("/api/getInvestorsByGeography/:geography", investorController.getInvestorsByGeography);
app.get("/api/getInvestorsBySector/:sector", investorController.getInvestorsBySector);
app.get("/api/getPendingInvestors", investorController.getPendingInvestors);
app.put("/api/approveInvestor/:id", investorController.approveInvestor);
app.put("/api/rejectInvestor/:id", investorController.rejectInvestor);
app.get("/api/getApprovedInvestors", investorController.getApprovedInvestors);

// EOI endpoints
app.post("/api/createEOI", eoiController.createEOI);
app.get("/api/getAllEOIs", eoiController.getAllEOIs);
app.get("/api/getEOIsByInvestor/:investor_id", eoiController.getEOIsByInvestor);
app.get("/api/checkEOIStatus", eoiController.checkEOIStatus);

// WatchList endpoints
app.post("/api/toggleDealInWatchlist", watchListController.toggleDealInWatchlist);
app.get("/api/getInvestorWatchlist/:investor_id", watchListController.getInvestorWatchlist);
app.get("/api/isDealInWatchlist", watchListController.isDealInWatchlist);
app.get("/api/getInvestorDashboard/:investor_id", watchListController.getInvestorDashboard);

// NDA endpoints
app.post("/api/signNDA", ndaController.signNDA);
app.get("/api/isNDASigned", ndaController.isNDASigned);
app.get("/api/getAllNDAAgreements", ndaController.getAllNDAAgreements);
app.get("/api/getAllSignedNDAs", ndaController.getAllSignedNDAs);

// Deal endpoints
app.post("/api/createDeal", handleFileUpload, dealController.createDeal);
app.get("/api/getDealInfo/:id", dealController.getDealById);
app.get("/api/getDealBySlug/:slug", dealController.getDealBySlug);
app.get("/api/getAllDeals", dealController.getAllDeals);
app.put("/api/updateDeal/:id", handleFileUpload, dealController.updateDeal);
app.delete("/api/deleteDeal/:id", dealController.deleteDeal);
app.get("/api/getDealsByStatus/:statusId", dealController.getDealsByStatus);
app.get("/api/getDealsByPriority/:priority", dealController.getDealsByPriority);
app.get("/api/getDealsByVisibility/:visibility", dealController.getDealsByVisibility);

// Blog endpoints
app.post("/api/createBlog", handleMultipleBlogFiles, blogController.createBlog);
app.get("/api/getAllBlogs", blogController.getAllBlogs);
app.get("/api/getBlogById/:id", blogController.getBlogById);
app.get("/api/getBlogBySlug/:slug", blogController.getBlogBySlug);
app.put("/api/updateBlog/:id", handleMultipleBlogFiles, blogController.updateBlog);
app.delete("/api/deleteBlog/:id", blogController.deleteBlog);

// Testimonial endpoints
app.post("/api/createTestimonial", handleTestimonialImageUpload, testimonialController.createTestimonial);
app.get("/api/getAllTestimonials", testimonialController.getAllTestimonials);
app.get("/api/getTestimonialById/:id", testimonialController.getTestimonialById);
app.put("/api/updateTestimonial/:id", handleTestimonialImageUpload, testimonialController.updateTestimonial);
app.delete("/api/deleteTestimonial/:id", testimonialController.deleteTestimonial);

// Public Home endpoints
app.get("/api/getPublicHomeData", publicHomeController.getPublicHomeData);


module.exports = app;
