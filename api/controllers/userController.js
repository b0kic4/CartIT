const User = require("../schemas/User");
const Image = require("../schemas/Image");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const express = require("express");
const app = express();

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
    const file = req.file;
    try {
      if (!file) {
        res.status(400).json({ success: false, message: "No file provided." });
        return;
      }
      const filePath = `/Users/boris/Documents/IOS/api/images/${file.filename}`; // Update with the actual file path
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error("Error reading the saved file:", err);
        } else {
          console.log("File content:", data); // Log the file content
          console.log("File size:", data.length); // Log the file size
        }
      });

      console.log("Req Body: ", req.body);
      let imageSize = parseInt(req.body.size, 10);
      if (!Number.isNaN(imageSize)) {
        file.size = imageSize;
      } else {
        // Handle the case where the size couldn't be parsed correctly
        return res
          .status(400)
          .json({ success: false, message: "Invalid file size." });
      }
      const fileExtension = file.uri?.split(".").pop().split("?")[0]; // Extract extension from the URI

      const imageName = `${uuidv4()}.${fileExtension}`;
      console.log("req.file: ", file);
      const image = new Image({
        userId: userId,
        name: file.originalname,
        imageUrl: file.path,
        contentType: file.mimetype,
        size: file.size,
      });

      // Save the image to the database
      await image.save();

      // Read the file content after saving
      const fileContent = fs.readFileSync(file.path);
      console.log("File content after saving:", fileContent);
      // CHECKING IF FILE.PATH.LENGHT
      console.log("File size after saving:", fileContent.length);

      res.status(201).json({
        success: true,
        message: "Image created successfully.",
        imageName: file.originalname,
        size: file.size,
      });
    } catch (error) {
      console.error("Error handling image:", error);
      res
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
