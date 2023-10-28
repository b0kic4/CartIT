const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");
const verifyToken = require("../middleware/VerifyToken");

router.post("/cart/add", verifyToken, CartController.addToCart);
router.post("/cart/:id/edit", verifyToken, CartController.editCartItem);
router.get("/cart", verifyToken, CartController.getCart);
router.delete(
  "/cart/:productId/remove",
  verifyToken,
  CartController.removeCartItem
);
router.delete("/cart/remove", verifyToken, CartController.removeAllCartItems);

module.exports = router;
