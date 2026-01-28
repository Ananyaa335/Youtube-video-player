const User = require("../models/user_model");
const { comparePassword } = require("../utils/user_password");

const bcrypt = require("bcrypt");
const redis = require("../config/redis");

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


//forgot password
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }
  //otp generation
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in Redis for 3 minutes
  const redisKey = `forgot-password:${email}`;
  await redis.setEx(redisKey, 180, otp);

  // TEMP: Log OTP (dev only)
  console.log("OTP:", otp);

  return { message: "OTP sent successfully" };
};

//otp verification
exports.verifyOtp = async (email, otp) => {
  const redisKey = `forgot-password:${email}`;
  const storedOtp = await redis.get(redisKey);

  if (!storedOtp) {
    throw new Error("OTP expired or invalid");
  }

  if (storedOtp !== otp) {
    throw new Error("Incorrect OTP");
  }

  return { message: "OTP verified successfully" };
};

//password reset
exports.resetPassword = async (email, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await User.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  // Remove OTP after successful reset
  await redis.del(`forgot-password:${email}`);

  return { message: "Password reset successful" };
};
