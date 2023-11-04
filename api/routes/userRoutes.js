const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const verifyToken = require("../middleware/VerifyToken");

router.get("/user/:id", verifyToken, UserController.getSingleUser);
router.post("/user/images", verifyToken, UserController.userProfileImages);
router.get(
  "/user/profile-image/:id",
  verifyToken,
  UserController.getUserProfileImage
);
module.exports = router;
