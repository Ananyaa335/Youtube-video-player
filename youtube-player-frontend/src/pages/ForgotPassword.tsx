import { useState } from "react";
import { forgotPassword, verifyOtp, resetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/forgotpassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");


  const handleEmailSubmit = async () => {
    try {
      setError("");
      setSuccessMsg("");
      await forgotPassword(email);
      setSuccessMsg("OTP sent successfully, Please check and verify.");

      setStep(2);
    } catch (err: any) {
      setError(err.message || "User not found");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setError("");
      await verifyOtp(email, otp);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      setError("");
      await resetPassword(email, newPassword, confirmPassword);
      alert("Password reset successful ✅");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Password reset failed");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>
          {successMsg && <p className="success-msg">{successMsg}</p>}


        {step === 1 && (
          <>
            <p className="forgot-subtitle">Enter your email</p>
            <div className="forgot-input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="forgot-btn" onClick={handleEmailSubmit}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="forgot-subtitle">Enter the 6-digit OTP</p>
            <div className="forgot-input-group">
              <label>OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button className="forgot-btn" onClick={handleOtpSubmit}>
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="forgot-subtitle">Set your new password</p>
            <div className="forgot-input-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="forgot-input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="forgot-btn" onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}

        {error && <p className="forgot-error">{error}</p>}

        <p className="back-login" onClick={() => navigate("/login")}>
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
