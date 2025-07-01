const Stage = require("../models/stage");

exports.createStage = async (stageData) => {
  return await Stage.create(stageData);
};

exports.updateStage = async (id, stageData) => {
  const stage = await Stage.findByIdAndUpdate(id, stageData, { new: true });
  if (!stage) throw new Error("Stage not found");
  return stage;
};

exports.getStageById = async (id) => {
  return await Stage.findById(id);
};

exports.getAllStages = async () => {
  return await Stage.find();
};

exports.deleteStage = async (id) => {
  const stage = await Stage.findByIdAndDelete(id);
  if (!stage) throw new Error("Stage not found");
};
