const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Product schema
const ProductSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  rating: { type: Number, required: true },
  stock: { type: Number, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: [{ type: String, required: true }],
});

// Create the Product model using the schema
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product; // Export the Product model for use in other parts of your application
