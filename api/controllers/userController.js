const User = require("../schemas/User");
const Image = require("../schemas/Image");
const fs = require("fs");

const userController = {
  getUsers: async (req, res) => {},
  // Getting user info from id
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
  // Setting image in database
  userProfileImages: async (req, res) => {
    const file = req.file;
    try {
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "No file provided." });
      }

      const filePath = file.path;
      console.log(req.file);
      const userId = req.user.id;

      const fileStats = fs.statSync(filePath);
      console.log("File Path: " + filePath);
      console.log("File stats:", fileStats);
      console.log("Form Data: ", JSON.stringify(req.body));
      if (fileStats.size > 0) {
        const image = new Image({
          userId: userId,
          name: file.originalname,
          imageUrl: file.path,
          contentType: file.mimetype,
          size: fileStats.size,
        });
        console.log("File stats size: " + fileStats.size);
        console.log("Req file size: " + req.file.size);
        await image.save();

        return res.status(201).json({
          success: true,
          message: "Image created successfully.",
          imageName: file.originalname,
          size: fileStats.size,
        });
      } else {
        return res
          .status(500)
          .json({ success: false, message: "File is empty." });
      }
    } catch (error) {
      console.error("Error handling image:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  },
  // Getting the image from database
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
  // When user uploads new image, it will delete the old image
  deleteImageFromDatabase: async (req, res) => {
    const userId = req.user.id;
    const image = await Image.findOne({ userId });
    await image.deleteOne();

    if (image) {
      return res
        .status(200)
        .json({ success: true, message: "Image deleted successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Error" });
    }
  },
};
module.exports = userController;
