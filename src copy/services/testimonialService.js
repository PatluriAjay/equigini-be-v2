const Testimonial = require("../models/testimonial");

exports.createTestimonial = async (testimonialData) => {
  return await Testimonial.create(testimonialData);
};

exports.getAllTestimonials = async () => {
  return await Testimonial.find({ is_active: true }).sort({ createdAt: -1 });
};

exports.getTestimonialById = async (id) => {
  return await Testimonial.findById(id);
};

exports.updateTestimonial = async (id, testimonialData) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, testimonialData, { new: true });
  if (!testimonial) throw new Error("Testimonial not found");
  return testimonial;
};

exports.deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, { is_active: false }, { new: true });
  if (!testimonial) throw new Error("Testimonial not found");
  return testimonial;
}; 