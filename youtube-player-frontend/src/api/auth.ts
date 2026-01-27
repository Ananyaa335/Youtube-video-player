const API_URL = "http://localhost:5000/api/auth";
export const loginUser = async (email: string, password: string) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    credentials: "include", // 🔑 REQUIRED for cookies
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) 
    throw new Error("Login failed");
  
    return res.json();
  };
  
  export const checkAuth = async () => {
    try{
      const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include"
  });

      if (!res.ok) {
        return null;
      }
      return await res.json();
    }catch (err){
      return null;
    }

  
};



export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("User not found");
  return res.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) throw new Error("Invalid OTP");
  return res.json();
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword, confirmPassword }),
  });

  if (!res.ok) throw new Error("Password reset failed");
  return res.json();
};
