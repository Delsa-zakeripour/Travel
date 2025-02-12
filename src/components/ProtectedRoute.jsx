import { useEffect } from "react";
import { useAuth } from "./context/FakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [navigate, isAuthenticated]);

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
