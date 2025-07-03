const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create blogs directory if it doesn't exist
const blogsDir = path.join(__dirname, "../files/blogs");
const wordDocsDir = path.join(blogsDir, "word-docs");
const imagesDir = path.join(blogsDir, "images");

if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir, { recursive: true });
}
if (!fs.existsSync(wordDocsDir)) {
  fs.mkdirSync(wordDocsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure storage for Word documents
const wordDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, wordDocsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "word-doc-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "blog-image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for Word documents
const wordDocFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only Word documents (.doc, .docx) are allowed"), false);
  }
};

// File filter for images
const imageFilter = (req, file, cb) => {
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

// Create multer instances
const uploadWordDoc = multer({
  storage: wordDocStorage,
  fileFilter: wordDocFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to handle blog file uploads
exports.handleBlogFileUpload = (req, res, next) => {
  // Handle Word document upload
  const wordDocUpload = uploadWordDoc.single("word_document");
  
  wordDocUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: err.message,
      });
    }

    // Handle featured image upload
    const imageUpload = uploadImage.single("featured_image");
    
    imageUpload(req, res, (imageErr) => {
      if (imageErr) {
        return res.status(400).json({
          result_code: 400,
          status: "E",
          error_info: imageErr.message,
        });
      }

      // Process uploaded files
      if (req.file) {
        // If only one file was uploaded, determine which type it is
        if (req.file.fieldname === "word_document") {
          req.body.word_document = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
          };
        } else if (req.file.fieldname === "featured_image") {
          req.body.featured_image = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
          };
        }
      }

      // Handle multiple files if both were uploaded
      if (req.files) {
        if (req.files.word_document) {
          req.body.word_document = {
            filename: req.files.word_document[0].filename,
            originalname: req.files.word_document[0].originalname,
            path: req.files.word_document[0].path,
            mimetype: req.files.word_document[0].mimetype,
            size: req.files.word_document[0].size,
          };
        }
        
        if (req.files.featured_image) {
          req.body.featured_image = {
            filename: req.files.featured_image[0].filename,
            originalname: req.files.featured_image[0].originalname,
            path: req.files.featured_image[0].path,
            mimetype: req.files.featured_image[0].mimetype,
            size: req.files.featured_image[0].size,
          };
        }
      }

      next();
    });
  });
};

// Middleware to handle multiple file uploads
exports.handleMultipleBlogFiles = (req, res, next) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === "word_document") {
          cb(null, wordDocsDir);
        } else if (file.fieldname === "featured_image") {
          cb(null, imagesDir);
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        if (file.fieldname === "word_document") {
          cb(null, "word-doc-" + uniqueSuffix + path.extname(file.originalname));
        } else if (file.fieldname === "featured_image") {
          cb(null, "blog-image-" + uniqueSuffix + path.extname(file.originalname));
        }
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.fieldname === "word_document") {
        const allowedMimes = [
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only Word documents (.doc, .docx) are allowed"), false);
        }
      } else if (file.fieldname === "featured_image") {
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
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  const uploadFields = upload.fields([
    { name: "word_document", maxCount: 1 },
    { name: "featured_image", maxCount: 1 },
  ]);

  uploadFields(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: err.message,
      });
    }

    // Process uploaded files
    if (req.files) {
      if (req.files.word_document) {
        req.body.word_document = {
          filename: req.files.word_document[0].filename,
          originalname: req.files.word_document[0].originalname,
          path: "files\\blogs\\word-docs\\" + req.files.word_document[0].filename,
          mimetype: req.files.word_document[0].mimetype,
          size: req.files.word_document[0].size,
        };
      }
      
      if (req.files.featured_image) {
        req.body.featured_image = {
          filename: req.files.featured_image[0].filename,
          originalname: req.files.featured_image[0].originalname,
          path: "files\\blogs\\images\\" + req.files.featured_image[0].filename,
          mimetype: req.files.featured_image[0].mimetype,
          size: req.files.featured_image[0].size,
        };
      }
    }

    next();
  });
}; 