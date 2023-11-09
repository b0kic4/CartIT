const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination directory where uploaded files will be stored
    cb(null, "/Users/boris/Documents/IOS/api/images");
  },
  filename: function (req, file, cb) {
    // Set the file name
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
