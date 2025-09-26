const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

if (!fs.existsSync("uploads/restaurant_images")) {
  fs.mkdirSync("uploads/restaurant_images", { recursive: true });
}

fs.chmodSync("uploads/restaurant_images", 0o777);

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/restaurant_images');
  },
  filename: (req, file, cb)=>{
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage })

module.exports = upload;