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
  const res = await fetch("http://localhost:5000/api/auth/me", {
    credentials: "include"
  });

  if (!res.ok) return null;

  return res.json();
};
