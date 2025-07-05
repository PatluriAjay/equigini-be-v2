const publicHomeService = require("../services/publicHomeService");

// Get public home data (latest 4 blogs + all testimonials)
exports.getPublicHomeData = async (req, res) => {
  try {
    const homeData = await publicHomeService.getPublicHomeData();
    res.json({
      result_code: 200,
      status: "S",
      result_info: homeData,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
}; 