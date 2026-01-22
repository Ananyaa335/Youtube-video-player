const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth_controller");
const { validateLogin } = require("../middlewares/validateinput");
const { loginLimiter } = require("../middlewares/ratelimiter");
const {protect} = require("../middlewares/auth_middleware");

router.post("/login", loginLimiter, validateLogin, login);

// auth check
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});
module.exports = router;
