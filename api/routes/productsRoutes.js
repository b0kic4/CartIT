const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
} = require("../controllers/ProductController");
const verifyToken = require("../middleware/VerifyToken");

router.get("/products", verifyToken, getProducts);
router.get("/products/:productId", verifyToken, getProductById);

module.exports = router;
