const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

// Create the User model using the schema
const User = mongoose.model("User", UserSchema);

module.exports = User; // Export the User model for use in other parts of your application
