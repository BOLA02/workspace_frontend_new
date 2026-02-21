import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Invalid user data:", error);
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // ✅ Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Role check (array)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}