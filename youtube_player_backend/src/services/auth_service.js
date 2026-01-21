const User = require("../models/user_model");
const { comparePassword } = require("../utils/user_password");

exports.loginUser = async (email, password) => {
const user = await User.findOne({ email }).select("+password");
  console.log(user)
  console.log(user.password)
  console.log(password)
  if (!user) return null;

  const valid = await comparePassword(password, user.password);
  if (!valid) return null;

  return user;
};
