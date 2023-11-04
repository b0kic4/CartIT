const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  data: { type: Buffer },
  contentType: { type: String },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
