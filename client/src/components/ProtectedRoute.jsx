import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        user = null;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        const dashboardByRole = {
            CANDIDATE: "/candidate",
            RECRUITER: "/recruiter",
            ADMIN: "/admin",
        };

        return <Navigate to={dashboardByRole[user?.role] || "/login"} replace />;
    }

    return children;
};

export default ProtectedRoute;
