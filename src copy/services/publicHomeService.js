const Blog = require("../models/blog");
const Testimonial = require("../models/testimonial");
const Deal = require("../models/deal");

// Get public home data (latest 4 blogs + latest 3 deals + all testimonials)
exports.getPublicHomeData = async () => {
  try {
    // Get latest 4 active blogs
    const latestBlogs = await Blog.find({ is_active: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select('title slug excerpt featured_image read_time createdAt');

    // Get latest 3 active deals (priority only)
    const latestDeals = await Deal.find({ is_active: true, deal_priority: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(4)
      .select('deal_title slug sector stage geography ticket_size_range expected_irr timeline summary image deal_icon createdAt');

    // Get all active testimonials
    const testimonials = await Testimonial.find({ is_active: true })
      .sort({ createdAt: -1 });

    return {
      latest_blogs: latestBlogs,
      latest_deals: latestDeals,
      testimonials: testimonials
    };
  } catch (error) {
    throw error;
  }
}; 