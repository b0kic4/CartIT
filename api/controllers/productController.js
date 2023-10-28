const Product = require("../schemas/Product");
const Cart = require("../schemas/Cart"); // Import the Cart model if not already imported
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    // console.log("Raw productId: ", req.params.productId);
    const productId = parseInt(req.params.productId, 10);
    // console.log("Parsed productId: " + productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid productId -> NAN" });
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const userId = req.user.id;

    let quantity = 0;
    const cartItem = await Cart.findOne({
      userId,
      "cartItems.productId": productId,
    });

    if (cartItem) {
      const item = cartItem.cartItems.find(
        (item) => item.productId === productId
      );
      if (item) {
        quantity = item.quantity;
      }
    }

    const product = await Product.findOne({ id: productId });

    if (product) {
      const productDataWithQuantity = { ...product.toJSON(), quantity };
      res.json(productDataWithQuantity);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
