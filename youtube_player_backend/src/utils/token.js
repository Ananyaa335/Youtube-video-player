const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "20m" });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
