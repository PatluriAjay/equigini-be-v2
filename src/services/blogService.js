const Blog = require("../models/blog");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");



// Helper function to calculate read time
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Helper function to extract excerpt
const extractExcerpt = (content, maxLength = 150) => {
  const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, maxLength).trim() + '...';
};

// Convert Word document to HTML using mammoth.js
const convertWordToHtml = async (filePath) => {
  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`Error converting Word document: ${error.message}`);
  }
};

// Create a new blog
exports.createBlog = async (blogData) => {
  try {
    // Validate required fields
    if (!blogData.title) {
      throw new Error("Title is required");
    }
    
    if (!blogData.slug) {
      throw new Error("Slug is required");
    }
    
    if (!blogData.word_document || !blogData.word_document.path) {
      throw new Error("Word document is required");
    }

    // Check if provided slug is unique
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    if (existingBlog) {
      throw new Error("Slug already exists");
    }

    // Convert Word document to HTML and extract content
    try {
      // Convert relative path to absolute path for mammoth.js
      const absolutePath = path.join(__dirname, '..', blogData.word_document.path);
      const htmlContent = await convertWordToHtml(absolutePath);
      blogData.content = htmlContent;
      
      // Calculate read time
      blogData.read_time = calculateReadTime(htmlContent);
      
      // Generate excerpt
      blogData.excerpt = extractExcerpt(htmlContent);
    } catch (error) {
      throw new Error(`Error processing Word document: ${error.message}`);
    }

    // Set default values if not provided
    blogData.created_by = blogData.created_by || 1;

    return await Blog.create(blogData);
  } catch (error) {
    throw error;
  }
};

// Get all blogs
exports.getAllBlogs = async () => {
  try {
    const blogs = await Blog.find({ is_active: true })
      .sort({ createdAt: -1 });

    return blogs;
  } catch (error) {
    throw error;
  }
};

// Get blog by ID
exports.getBlogById = async (id) => {
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  } catch (error) {
    throw error;
  }
};

// Get blog by slug
exports.getBlogBySlug = async (slug) => {
  try {
    const blog = await Blog.findOne({ slug, is_active: true });
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  } catch (error) {
    throw error;
  }
};

// Update blog
exports.updateBlog = async (id, blogData) => {
  try {
    // Check if provided slug is unique (excluding current blog)
    if (blogData.slug) {
      const existingBlog = await Blog.findOne({ slug: blogData.slug, _id: { $ne: id } });
      if (existingBlog) {
        throw new Error("Slug already exists");
      }
    }

    // Convert Word document to HTML if provided
    if (blogData.word_document && blogData.word_document.path) {
      try {
        // Convert relative path to absolute path for mammoth.js
        const absolutePath = path.join(__dirname, '..', blogData.word_document.path);
        const htmlContent = await convertWordToHtml(absolutePath);
        blogData.content = htmlContent;
        
        // Calculate read time
        blogData.read_time = calculateReadTime(htmlContent);
        
        // Generate excerpt
        blogData.excerpt = extractExcerpt(htmlContent);
      } catch (error) {
        throw new Error(`Error processing Word document: ${error.message}`);
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  } catch (error) {
    throw error;
  }
};

// Delete blog
exports.deleteBlog = async (id) => {
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Delete associated files if they exist
    if (blog.word_document && blog.word_document.path) {
      try {
        const absolutePath = path.join(__dirname, '..', blog.word_document.path);
        fs.unlinkSync(absolutePath);
      } catch (error) {
        console.log("Error deleting Word document file:", error.message);
      }
    }

    if (blog.featured_image && blog.featured_image.path) {
      try {
        const absolutePath = path.join(__dirname, '..', blog.featured_image.path);
        fs.unlinkSync(absolutePath);
      } catch (error) {
        console.log("Error deleting featured image file:", error.message);
      }
    }

    await Blog.findByIdAndDelete(id);
    return { message: "Blog deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Increment blog views
exports.incrementViews = async (id) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  } catch (error) {
    throw error;
  }
};

// Get blogs by category
exports.getBlogsByCategory = async (category) => {
  try {
    const blogs = await Blog.find({ 
      category, 
      is_active: true,
      status: 'published'
    }).sort({ createdAt: -1 });
    return blogs;
  } catch (error) {
    throw error;
  }
};

// Get blogs by author
exports.getBlogsByAuthor = async (authorId) => {
  try {
    const blogs = await Blog.find({ 
      author_id: authorId, 
      is_active: true 
    }).sort({ createdAt: -1 });
    return blogs;
  } catch (error) {
    throw error;
  }
};

// Search blogs
exports.searchBlogs = async (searchTerm) => {
  try {
    const blogs = await Blog.find({
      $and: [
        { is_active: true },
        {
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { content: { $regex: searchTerm, $options: 'i' } },
            { excerpt: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } },
            { category: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      ]
    }).sort({ createdAt: -1 });
    return blogs;
  } catch (error) {
    throw error;
  }
}; 