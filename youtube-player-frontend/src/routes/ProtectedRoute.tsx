import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuth, children }: any) => {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
