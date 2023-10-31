const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const verifyToken = require("../middleware/VerifyToken");

router.get("/user/:id", verifyToken, UserController.getSingleUser);
module.exports = router;
