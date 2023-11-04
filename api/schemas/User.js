const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  orderDate: { type: Date, default: Date.now },
  purchasedItems: [
    {
      orderId: { type: String },
      productId: { type: Number },
      category: { type: String },
      brand: { type: String },
      title: { type: String },
      description: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      thumbnail: { type: String },
      productImages: [{ type: String }],
      totalItems: { type: Number },
      totalPrice: { type: Number },
      isPaid: { type: Boolean, default: false },
    },
  ],
  orderUserInfo: [
    {
      name: { type: String },
      address: { type: String },
      city: { type: String },
      country: { type: String },
    },
  ],
});

// Create the User model using the schema
const User = mongoose.model("User", UserSchema);

module.exports = User; // Export the User model for use in other parts of your application
