const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CheckOutSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String },
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
  totalItems: { type: Number, default: 1 },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: {
    type: {
      method: { type: String }, //"card" or "courier"
      cardInfo: {
        cardNumber: { type: String },
        cardHolderName: { type: String },
        expirationDate: { type: String },
        cvv: { type: String },
      },
      userAddress: {
        name: { type: String },
        address: { type: String },
        city: { type: String },
        country: { type: String },
      },
    },
  },
});

module.exports = mongoose.model("CheckOut", CheckOutSchema);
