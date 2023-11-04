const User = require("../schemas/User");
const Image = require("../schemas/Image");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const storagePath = "/Users/boris/Documents/IOS/api/images/";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, storagePath);
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname?.split(".").pop(),
      console.log("File originalName: " + file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const userController = {
  getUsers: async (req, res) => {},
  getSingleUser: async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await User.findById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching single user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  userProfileImages: async (req, res) => {
    const userId = req.user.id;
    upload.single("fileName")(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ success: false, message: "Error uploading file." });
        } else if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }

        // Check if file exists in the request object

        const file = req.body;
        console.log("Req.file: ", file);

        // console.log("REQ: ", req);
        console.log("req body", req.body);
        // Check if file exists
        if (!file) {
          res
            .status(400)
            .json({ success: false, message: "No file provided." });
          return;
        }

        const fileExtension = file.uri.split(".").pop().split("?")[0]; // Extract extension from the URI
        const contentType = `image/${
          fileExtension === "jpg" ? "jpeg" : fileExtension
        }`;

        const imageName = `${uuidv4()}.${fileExtension}`;

        const image = new Image({
          userId: userId,
          name: imageName,
          data: file.buffer,
          contentType: contentType,
        });
        console.log("Saved: ", image);
        await image.save();

        res.status(201).json({
          success: true,
          message: "Image created successfully.",
          imageName: imageName,
        });
      } catch (error) {
        console.error("Error handling image:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });
  },

  getUserProfileImage: async (req, res) => {
    try {
      const userId = req.user.id;
      const image = await Image.findOne({ userId });
      console.log("Founded image: ", image);
      if (!image) {
        return res
          .status(404)
          .json({ success: false, message: "Image not found" });
      }

      res.set("Content-Type", image.contentType);
      res.send(image);
    } catch (error) {
      console.error("Error fetching user image:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
module.exports = userController;
