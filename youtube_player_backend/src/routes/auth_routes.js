const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth_controller");
const { validateLogin } = require("../middlewares/validateinput");
const { loginLimiter } = require("../middlewares/ratelimiter");

router.post("/login", loginLimiter, validateLogin, login);

module.exports = router;
