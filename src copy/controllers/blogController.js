const blogService = require("../services/blogService");

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Title is required"
      });
    }

    if (!req.body.slug) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Slug is required"
      });
    }

    if (!req.body.word_document || !req.body.word_document.path) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: "Word document is required"
      });
    }

    const blog = await blogService.createBlog(req.body);
    res.status(200).json({
      result_code: 200,
      status: "S",
      result_info: blog,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.json({
      result_code: 200,
      status: "S",
      result_info: {
        count: blogs.length,
        blogs: blogs
      },
    });
  } catch (err) {
    res.status(400).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    
    // Increment views when blog is viewed
    await blogService.incrementViews(req.params.id);
    
    res.json({
      result_code: 200,
      status: "S",
      result_info: blog,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 404,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Get blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    
    // Increment views when blog is viewed
    await blogService.incrementViews(blog._id);
    
    res.json({
      result_code: 200,
      status: "S",
      result_info: blog,
    });
  } catch (err) {
    res.status(200).json({
      result_code: 404,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    res.json({
      result_code: 200,
      status: "S",
      result_info: blog,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const result = await blogService.deleteBlog(req.params.id);
    res.json({
      result_code: 200,
      status: "S",
      result_info: result,
    });
  } catch (err) {
    res.status(500).json({
      result_code: 400,
      status: "E",
      error_info: err.message || err,
    });
  }
};
