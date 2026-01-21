const jwt = require("jsonwebtoken");

const JWT_SECRET = "SUPER_SECRET_KEY";

exports.createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "20m" });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
