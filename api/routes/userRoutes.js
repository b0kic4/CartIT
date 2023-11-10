const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const verifyToken = require("../middleware/VerifyToken");
const upload = require("../config/MulterConfig"); // Check the path to MulterConfig
const userController = require("../controllers/UserController");

router.get("/user/:id", verifyToken, UserController.getSingleUser);

router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  UserController.userProfileImages
);

router.get(
  "/user/profile-image/:id",
  verifyToken,
  UserController.getUserProfileImage
);
router.delete(
  "/user/profile-image-delete/:id",
  verifyToken,
  userController.deleteImageFromDatabase
);

module.exports = router;
