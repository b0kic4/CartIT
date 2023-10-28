const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwtSecretKey = crypto.randomBytes(32).toString("hex");
const cookieParser = require("cookie-parser");

const Register = async (req, res) => {
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
};

const Login = async (req, res) => {
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
};

const Logout = (req, res) => {
  res.clearCookie("token"); // Clear the "token" cookie
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  jwtSecretKey,
  Register,
  Login,
  Logout,
};
