const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { jwtSecretKey } = require("../controllers/AuthController");
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

module.exports = verifyToken;
