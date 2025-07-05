const ticketsizeService = require("../services/ticketsizeService");

// Create a new ticket size
exports.createTicketSize = async (req, res) => {
  try {
    const ticketsize = await ticketsizeService.createTicketSize(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: ticketsize,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update an existing ticket size
exports.updateTicketSize = async (req, res) => {
  try {
    const ticketsize = await ticketsizeService.updateTicketSize(req.params.id, req.body);
    res.json({
      result_code: 200,
      status: "S",
      result_info: ticketsize,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get a single ticket size by ID
exports.getTicketSizeById = async (req, res) => {
  try {
    const ticketsize = await ticketsizeService.getTicketSizeById(req.params.id);
    if (!ticketsize)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "TicketSize not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: ticketsize,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all ticket sizes
exports.getAllTicketSizes = async (req, res) => {
  try {
    const ticketsizes = await ticketsizeService.getAllTicketSizes();
    // Sort ticket sizes by creation date (newest first)
    const sortedTicketSizes = ticketsizes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      result_code: 200,
      status: "S",
      result_info: sortedTicketSizes,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Delete a ticket size
exports.deleteTicketSize = async (req, res) => {
  try {
    await ticketsizeService.deleteTicketSize(req.params.id);
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
