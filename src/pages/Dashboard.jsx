import { useEffect, useState } from "react"

import DashboardHeader from "../components/dashboard/DashboardHeader"
import StatsGrid from "../components/dashboard/StatsGrid"
import WorkspaceTypeTable from "../components/dashboard/WorkspaceTypeTable"
import PaymentMethodTable from "../components/dashboard/PaymentMethodTable"
import QuickActions from "../components/dashboard/QuickActions"
import LoadingScreen from "../components/dashboard/LoadingScreen"
import ErrorScreen from "../components/dashboard/ErrorScreen"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = "http://localhost:3000"

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return (window.location.href = "/login")

      const res = await fetch(`${API_URL}/api/analytics/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        localStorage.clear()
        return (window.location.href = "/login")
      }

      if (!res.ok) throw new Error("Failed to fetch statistics")

      setStats(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen error={error} onRetry={fetchStats} />

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <DashboardHeader />
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkspaceTypeTable data={stats?.byWorkspaceType} />
        <PaymentMethodTable data={stats?.byPaymentMethod} />
      </div>

      <QuickActions />
    </div>
  )
}
