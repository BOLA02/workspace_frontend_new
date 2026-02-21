import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      setIsAuthenticated(false)
      return
    }

    try {
      const user = JSON.parse(userStr)
      setUserRole(user.role)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Invalid user data:", error)
      setIsAuthenticated(false)
    }
  }, [])

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Role check - if specific role is required
  if (role && userRole !== role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return children
}