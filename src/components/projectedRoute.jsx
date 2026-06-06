import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({
    children,
    role
}) => {

    const { user, loading } =
        useAuthContext();

    if (loading) {
        return <Spinner />;
    }

    if (!user) {
        return <Navigate to="/auth/login" />;
    }

    // Role protection

    if (
        role &&
        user.role !== role
    ) {

        if (user.role === "owner") {
            return <Navigate to="/owner" />;
        }

        if (user.role === "employee") {
            return <Navigate to="/employee" />;
        }

        return <Navigate to="/auth/login" />;
    }

    return children;
};

export default ProtectedRoute;