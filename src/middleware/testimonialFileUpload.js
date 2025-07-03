const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create testimonials directory if it doesn't exist
const testimonialsDir = path.join(__dirname, "../files/testimonials");

if (!fs.existsSync(testimonialsDir)) {
  fs.mkdirSync(testimonialsDir, { recursive: true });
}

// Configure storage for testimonial images
const testimonialImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, testimonialsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "testimonial-image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for testimonial images
const testimonialImageFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"), false);
  }
};

// Create multer instance for testimonial images
const uploadTestimonialImage = multer({
  storage: testimonialImageStorage,
  fileFilter: testimonialImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to handle testimonial image upload
exports.handleTestimonialImageUpload = (req, res, next) => {
  const upload = uploadTestimonialImage.single("user_img");
  
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: err.message,
      });
    }

    // Process uploaded file
    if (req.file) {
      req.body.user_img = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: "files\\testimonials\\" + req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    next();
  });
}; 