const User = require("../schemas/User");
const Image = require("../schemas/Image");
const fs = require("fs");
const { type } = require("os");

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
    const file = req.file;
    const userId = req.user.id;
    console.log("Req body: ", JSON.stringify(req.body));
    try {
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "No file provided." });
      }

      const filePath = file.path;
      console.log(req.file);

      // Ensure you're capturing the file size after the upload is completed
      const fileStats = fs.statSync(filePath);
      console.log("File Path: " + filePath);
      console.log("File stats:", fileStats);
      if (fileStats.size > 0) {
        const image = new Image({
          userid: userId,
          name: file.originalname,
          imageUrl: file.path,
          contentType: file.mimetype,
          size: fileStats.size,
        });

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
