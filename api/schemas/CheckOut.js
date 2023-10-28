const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CheckOutSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      productId: { type: Number },
      category: { type: String },
      brand: { type: String },
      title: { type: String },
      description: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      thumbnail: { type: String },
      productName: { type: String },
      productImages: [{ type: String }],
    },
  ],
  totalPrice: { type: Number },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CheckOut", CheckOutSchema);
