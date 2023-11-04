const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 8000;

// Routes
const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use("/images", express.static("api/images"));
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

// use Routes
app.use(authRoutes);
app.use(productsRoutes);
app.use(cartRoutes);
app.use(userRoutes);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
