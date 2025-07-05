const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'files/deals/teaser',
    'files/deals/collateral/pitch',
    'files/deals/collateral/deck',
    'files/deals/collateral/im',
    'files/deals/collateral/financials',
    'files/deals/images',
    'files/deals/icons'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'files/deals/';
    
    // Determine upload path based on file type
    if (file.fieldname === 'teaser_document') {
      uploadPath += 'teaser/';
    } else if (file.fieldname === 'deal_collateral_pitch') {
      uploadPath += 'collateral/pitch/';
    } else if (file.fieldname === 'deal_collateral_deck') {
      uploadPath += 'collateral/deck/';
    } else if (file.fieldname === 'deal_collateral_im') {
      uploadPath += 'collateral/im/';
    } else if (file.fieldname === 'deal_collateral_financials') {
      uploadPath += 'collateral/financials/';
    } else if (file.fieldname === 'image') {
      uploadPath += 'images/';
    } else if (file.fieldname === 'deal_icon') {
      uploadPath += 'icons/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = {
    'teaser_document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'],
    'deal_collateral_pitch': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'],
    'deal_collateral_deck': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'],
    'deal_collateral_im': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'],
    'deal_collateral_financials': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'],
    'image': ['image/jpeg', 'image/jpg', 'image/png'],
    'deal_icon': ['image/jpeg', 'image/jpg', 'image/png']
  };

  const allowedTypes = allowedMimeTypes[file.fieldname] || [];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 8 // Maximum 8 files (teaser + 4 collateral + image + icon)
  }
});

// Middleware for handling file uploads
const handleFileUpload = (req, res, next) => {
  upload.fields([
    { name: 'teaser_document', maxCount: 1 },
    { name: 'deal_collateral_pitch', maxCount: 1 },
    { name: 'deal_collateral_deck', maxCount: 1 },
    { name: 'deal_collateral_im', maxCount: 1 },
    { name: 'deal_collateral_financials', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'deal_icon', maxCount: 1 }
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: `File upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        result_code: 400,
        status: "E",
        error_info: err.message
      });
    }
    
    // Process uploaded files and add to request body
    if (req.files) {
      const fileData = {};
      
      // Process teaser document
      if (req.files.teaser_document) {
        const file = req.files.teaser_document[0];
        fileData.teaser_document = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };
      }
      
      // Process deal collateral files
      fileData.deal_collateral = {};
      
      if (req.files.deal_collateral_pitch) {
        const file = req.files.deal_collateral_pitch[0];
        fileData.deal_collateral.pitch = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };
      }
      
      if (req.files.deal_collateral_deck) {
        const file = req.files.deal_collateral_deck[0];
        fileData.deal_collateral.deck = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };
      }
      
      if (req.files.deal_collateral_im) {
        const file = req.files.deal_collateral_im[0];
        fileData.deal_collateral.im = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };
      }
      
      if (req.files.deal_collateral_financials) {
        const file = req.files.deal_collateral_financials[0];
        fileData.deal_collateral.financials = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };
      }
      
      // Process image
      if (req.files.image) {
        const file = req.files.image[0];
        fileData.image = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };
      }
      
      // Process deal icon
      if (req.files.deal_icon) {
        const file = req.files.deal_icon[0];
        fileData.deal_icon = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };
      }
      
      // Merge file data with request body
      req.body = { ...req.body, ...fileData };
    }
    
    next();
  });
};

module.exports = { handleFileUpload }; 