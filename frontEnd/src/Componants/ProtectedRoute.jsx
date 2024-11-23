import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        // Redirect to login page if user is not authenticated
        return <Navigate to="/" replace />;
    }

    // Render the children (protected component) if authenticated
    return children;
};

export default ProtectedRoute;