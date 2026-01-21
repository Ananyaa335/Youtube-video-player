const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts"
});
