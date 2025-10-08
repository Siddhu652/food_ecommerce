const multer = require("multer");

// Store file in memory (no disk write)
const storage = multer.memoryStorage();

// Multer middleware setup
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit 5 MB per file (safety)
  },
});

module.exports = upload;
