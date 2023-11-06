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
        name: file.filename,
        data: file.buffer,
        imageUrl: file.path,
        contentType: file.mimetype,
        size: file.size,
      });
      console.log("File Buffer", file.buffer);
      console.log("Saved: ", image);
      // await image.save();

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
