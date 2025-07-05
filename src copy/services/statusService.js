const Status = require("../models/status");

exports.createStatus = async (statusData) => {
  return await Status.create(statusData);
};

exports.updateStatus = async (id, statusData) => {
  const status = await Status.findByIdAndUpdate(id, statusData, { new: true });
  if (!status) throw new Error("Status not found");
  return status;
};

exports.getStatusById = async (id) => {
  return await Status.findById(id);
};

exports.getAllStatuses = async () => {
  return await Status.find();
};

exports.deleteStatus = async (id) => {
  const status = await Status.findByIdAndDelete(id);
  if (!status) throw new Error("Status not found");
};
