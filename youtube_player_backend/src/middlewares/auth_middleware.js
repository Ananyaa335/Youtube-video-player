const { verifyToken } = require("../utils/token");

exports.protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
