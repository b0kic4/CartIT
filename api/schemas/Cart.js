const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      productId: { type: Number },
      category: { type: String },
      brand: { type: String },
      title: { type: String },
      description: { type: String },
      stock: { type: Number },
      quantity: { type: Number, default: 1 },
      price: { type: Number },
      thumbnail: { type: String },
      productName: { type: String },
      productImages: [{ type: String }],
    },
  ],
  totalPrice: { type: Number, default: 0 },
  totalCartItems: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Cart", CartSchema);
