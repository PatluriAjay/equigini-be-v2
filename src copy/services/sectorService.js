const Sector = require("../models/sector");

exports.createSector = async (sectorData) => {
  return await Sector.create(sectorData);
};

exports.updateSector = async (id, sectorData) => {
  const sector = await Sector.findByIdAndUpdate(id, sectorData, { new: true });
  if (!sector) throw new Error("Sector not found");
  return sector;
};

exports.getSectorById = async (id) => {
  return await Sector.findById(id);
};

exports.getAllSectors = async () => {
  return await Sector.find();
};

exports.deleteSector = async (id) => {
  const sector = await Sector.findByIdAndDelete(id);
  if (!sector) throw new Error("Sector not found");
};
