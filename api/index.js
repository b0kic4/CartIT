const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 8000;

// Schemas
const User = require("./schemas/User");
const Product = require("./schemas/Product");
const Cart = require("./schemas/Cart");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

require("dotenv").config();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
  });

// Define a POST route for user registration
const jwt = require("jsonwebtoken");
const jwtSecretKey = crypto.randomBytes(32).toString("hex");

app.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await User.create({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc) {
    const isMatch = bcrypt.compareSync(password, userDoc.password);

    if (isMatch) {
      // Create a JWT with a 6-hour expiration time (adjust as needed)
      jwt.sign(
        {
          username: userDoc.username,
          id: userDoc._id,
        },
        jwtSecretKey,
        (err, token) => {
          if (err) {
            console.error("Error signing JWT:", err);
            res.status(500).json({ message: "Internal server error" });
          } else {
            res.cookie("token", token, {
              httpOnly: true,
              sameSite: "none",
              secure: true,
            });

            res.json({
              id: userDoc._id,
              username,
              token,
              message: "Successfully logged in",
            });
          }
        }
      );
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the "token" cookie
  res.status(200).json({ message: "Logged out successfully" });
});

// verification token method
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
app.use(verifyToken);

// get products from db
app.get("/products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/products/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate if productId is provided and is a valid number
    if (!productId || isNaN(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const userId = req.user.id;
    const itemIndex = 0;
    let quantity = 0;

    // Fetch the cart item for the specific product
    const cartItem = await Cart.findOne({
      userId,
      "cartItems.productId": productId,
    });

    // Check if cartItem is found
    if (!cartItem) {
      // If cartItem is not found, set quantity to 0
      quantity = 0;
    } else {
      // Iterate through the cart items and find the item at the specified index
      cartItem.cartItems.forEach((item, index) => {
        if (index === itemIndex) {
          // Set 'quantity' to the quantity of the selected item
          quantity = item.quantity;
        }
      });
    }

    // Fetch the product data
    const product = await Product.findOne({ id: productId });

    if (product) {
      // Include the quantity in the response
      const productDataWithQuantity = { ...product.toJSON(), quantity };
      res.json(productDataWithQuantity);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/cart/add", verifyToken, async (req, res) => {
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
});

// Quantity edit in the Cart component
app.post("/cart/:id/edit", verifyToken, async (req, res) => {
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
});

app.get("/cart", verifyToken, async (req, res) => {
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
});

app.delete("/cart/:productId/remove", verifyToken, async (req, res) => {
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
});
app.delete("/cart/remove", verifyToken, async (req, res) => {
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
});

app.put("/", async (req, res) => {
  res.send("Kurac");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
