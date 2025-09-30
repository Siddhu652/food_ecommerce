const multer = require("multer");

// Use memory storage (keeps file in RAM instead of saving to disk)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
