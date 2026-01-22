import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/login";
import VideoPlayer from "./pages/VideoPlayer";
import { checkAuth } from "./api/auth";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Check login status on app load
  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth();
      if (user) setIsAuth(true);
      setLoading(false);
    };
    verifyAuth();
  }, []);

  // ⏳ Prevent UI flicker
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div>
      <h1>Youtube video player</h1>
      
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={<Login setIsAuth={setIsAuth} />}
        />

        {/* VIDEO PLAYER (PROTECTED) */}
        <Route
          path="/player"
          element={
            isAuth ? <VideoPlayer /> : <Navigate to="/login" replace />
          }
        />

        {/* DEFAULT ROUTE */}
        <Route
          path="*"
          element={
            isAuth ? <Navigate to="/player" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
    </div>
    
  );
};

export default App;
