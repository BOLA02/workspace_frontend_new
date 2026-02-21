import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

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

  // Loading
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role blocked
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-slate-300 mb-6">
            You don&apos;t have permission to access this page.
          </p>

          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}