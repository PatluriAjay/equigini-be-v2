const testimonialService = require("../services/testimonialService");

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    // Prepare testimonial data
    const testimonialData = {
      user_name: req.body.user_name,
      investor_type: req.body.investor_type,
      message: req.body.message,
    };

    // Handle image upload
    if (req.body.user_img && req.body.user_img.path) {
      testimonialData.user_img = req.body.user_img.path;
    } else if (req.body.user_img) {
      // If user_img is a string (direct URL or path)
      testimonialData.user_img = req.body.user_img;
    } else {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "User image is required",
      });
    }

    const testimonial = await testimonialService.createTestimonial(testimonialData);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: testimonial,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    res.json({
      result_code: 200,
      status: "S",
      result_info: testimonials,
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await testimonialService.getTestimonialById(req.params.id);
    if (!testimonial)
      return res.status(200).json({
        result_code: 404,
        status: "E",
        result_info: "Testimonial not found",
      });
    res.json({
      result_code: 200,
      status: "S",
      result_info: testimonial,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    // Prepare testimonial data
    const testimonialData = {
      user_name: req.body.user_name,
      investor_type: req.body.investor_type,
      message: req.body.message,
    };

    // Handle image upload
    if (req.body.user_img && req.body.user_img.path) {
      testimonialData.user_img = req.body.user_img.path;
    } else if (req.body.user_img) {
      // If user_img is a string (direct URL or path)
      testimonialData.user_img = req.body.user_img;
    }

    const testimonial = await testimonialService.updateTestimonial(req.params.id, testimonialData);
    res.json({
      result_code: 200,
      status: "S",
      result_info: testimonial,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Delete testimonial (soft delete)
exports.deleteTestimonial = async (req, res) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);
    res.json({
      result_code: 200,
      status: "S",
      result_info: "Testimonial deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
}; 