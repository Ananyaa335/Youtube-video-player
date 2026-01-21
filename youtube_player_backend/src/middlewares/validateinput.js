exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Invalid input" });

  if (password.length < 8)
    return res.status(400).json({ message: "Invalid input" });

  // Prevent JS / HTML injection
  if (/<script>/i.test(email) || /<script>/i.test(password))
    return res.status(400).json({ message: "Malicious input detected" });

  next();
};
