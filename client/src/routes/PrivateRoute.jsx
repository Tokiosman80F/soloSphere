import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../provider/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  // Show loading spinner while authentication status is loading
  if (loading) return <LoadingSpinner />;
  // Render children if the user is authenticated
  if (user) return children;
  return (
    // Redirect to login if the user is not Authenticated
    <Navigate to="/login" state={{ from: location }} replace={true}></Navigate>
  );
};

export default PrivateRoute;
