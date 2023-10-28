const Cart = require("../schemas/Cart");

const CartController = {
  // Adding product to Cart
  addToCart: async (req, res) => {
    const {
      productId,
      quantity,
      category,
      brand,
      title,
      price,
      description,
      productName,
      productImages,
      thumbnail,
      stock,
    } = req.body;
    const userId = req.user.id;

    try {
      const existingCartItem = await Cart.findOne({
        userId,
        "cartItems.productId": productId,
      });

      if (existingCartItem) {
        // If the product exists in the cart, update the quantity
        const cartItemIndex = existingCartItem.cartItems.findIndex(
          (item) => item.productId === productId
        );

        if (cartItemIndex !== -1) {
          // Update the quantity of the existing cart item
          existingCartItem.cartItems[cartItemIndex].quantity = quantity;
          await existingCartItem.save(); // Save the updated cart item
        }
      } else {
        // If the product does not exist in the cart, create a new cart item
        const newCartItem = {
          productId,
          category,
          brand,
          title,
          productName,
          productImages,
          thumbnail,
          description,
          quantity,
          price,
          stock,
        };
        await Cart.findOneAndUpdate(
          { userId },
          { $push: { cartItems: newCartItem } },
          { upsert: true }
        );
      }

      res.status(200).json({ message: "Product added to cart" });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // Editing Cart item quantity from my Cart
  editCartItem: async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    console.log(req.body);
    try {
      const existingCartItem = await Cart.findOne({
        userId,
        "cartItems.productId": productId,
      });

      if (existingCartItem) {
        // If the product exists in the cart, update the quantity
        const cartItemIndex = existingCartItem.cartItems.findIndex(
          (item) => item.productId === productId
        );
        if (cartItemIndex !== -1) {
          // Update the quantity of the existing cart item
          existingCartItem.cartItems[cartItemIndex].quantity = quantity;
          await existingCartItem.save(); // Save the updated cart item

          res.status(200).json({ message: "Product quantity updated" });
        } else {
          // Product not found in the cart (this should not happen)
          res.status(404).json({ message: "Product not found in the cart" });
        }
      } else {
        // Cart not found (this should not happen)
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      console.error("Error updating product quantity in the cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //   Getting Cart items and displaying them in front
  getCart: async (req, res) => {
    const userId = req.user.id;
    try {
      const userCart = await Cart.findOne({ userId }).populate(
        "cartItems.productId"
      );
      if (userCart) {
        res.json(userCart);
      } else {
        res.status(404).json({ message: "Cart Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //   Removing single product form Cart
  removeCartItem: async (req, res) => {
    console.log("Item Cart deletion route handler invoked.");
    const userId = req.user.id;
    const productId = req.params.productId;
    const productIdNumber = parseInt(productId, 10);

    try {
      console.log("User ID:", userId);
      console.log("Product ID to delete:", productId);

      // Find the user's cart
      const userCart = await Cart.findOne({ userId });
      console.log("User Cart:", userCart);

      if (userCart) {
        // Find the index of the item with the specified productId
        const itemIndex = userCart.cartItems.findIndex(
          (item) => item.productId === productIdNumber
        );

        if (itemIndex !== -1) {
          // Remove the item from the cartItems array by index
          userCart.cartItems.splice(itemIndex, 1);

          // Save the updated cart
          await userCart.save();
          console.log("Updated User Cart:", userCart);
          console.log("Product ID after deletion:", productId);
          console.log("User ID after deletion:", userId);

          res.status(200).json({ message: "Item removed from cart" });
        } else {
          res.status(404).json({ message: "Item Not Found in Cart" });
        }
      } else {
        res.status(404).json({ message: "Cart Not Found" });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //   Removing all produts from Cart
  removeAllCartItems: async (req, res) => {
    const userId = req.user.id;
    try {
      // Find the user's cart and remove all cart items
      const userCart = await Cart.findOne({ userId });
      if (userCart) {
        // Remove all cart items
        userCart.cartItems = [];
        await userCart.save();

        res.status(200).json({ message: "All cart items removed" });
      } else {
        res.status(404).json({ message: "Cart Not Found" });
      }
    } catch (error) {
      console.error("Error removing all cart items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = CartController;
