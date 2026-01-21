const { createToken } = require("../utils/token");
const { loginUser } = require("../services/auth_service");

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
