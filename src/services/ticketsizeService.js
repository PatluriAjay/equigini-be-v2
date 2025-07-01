const TicketSize = require("../models/ticketsize");

exports.createTicketSize = async (ticketsizeData) => {
  return await TicketSize.create(ticketsizeData);
};

exports.updateTicketSize = async (id, ticketsizeData) => {
  const ticketsize = await TicketSize.findByIdAndUpdate(id, ticketsizeData, { new: true });
  if (!ticketsize) throw new Error("TicketSize not found");
  return ticketsize;
};

exports.getTicketSizeById = async (id) => {
  return await TicketSize.findById(id);
};

exports.getAllTicketSizes = async () => {
  return await TicketSize.find();
};

exports.deleteTicketSize = async (id) => {
  const ticketsize = await TicketSize.findByIdAndDelete(id);
  if (!ticketsize) throw new Error("TicketSize not found");
};
