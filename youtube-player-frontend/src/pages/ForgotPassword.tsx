import { useState } from "react";
import { forgotPassword, verifyOtp, resetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  /* STEP 1: EMAIL */
  const handleEmailSubmit = async () => {
    try {
      setError("");
      await forgotPassword(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* STEP 2: OTP */
  const handleOtpSubmit = async () => {
    try {
      setError("");
      await verifyOtp(email, otp);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* STEP 3: RESET PASSWORD */
  const handleResetPassword = async () => {
    try {
      setError("");
      await resetPassword(email, newPassword, confirmPassword);
      alert("Password reset successful ✅");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Forgot Password</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />
          <button onClick={handleEmailSubmit}>Send OTP</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />
          <button onClick={handleOtpSubmit}>Verify OTP</button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br /><br />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br /><br />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
