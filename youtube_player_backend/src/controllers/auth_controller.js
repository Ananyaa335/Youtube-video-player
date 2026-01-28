const { createToken } = require("../utils/token");
const { loginUser } = require("../services/auth_service");
const authService = require("../services/auth_service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken({ id: user._id, role: user.role });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//verify otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const result = await authService.resetPassword(
      email,
      newPassword,
      confirmPassword
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};