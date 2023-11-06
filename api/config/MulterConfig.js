const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Users/boris/Documents/IOS/api/images");
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname +
      "-" +
      uniqueSuffix +
      "." +
      file.originalname.split(".").pop();

    console.log("File originalName: " + file.originalname);
    console.log("Generated filename: " + fileName);

    callback(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

module.exports = upload;
