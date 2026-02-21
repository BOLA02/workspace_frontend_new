import { Calendar, Banknote, TrendingUp, Users } from "lucide-react"
import StatCard from "./StatCard"

export default function StatsGrid({ stats }) {
  const avg =
    stats?.totalBookings
      ? (stats.totalRevenue / stats.totalBookings).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={Calendar}
        label="Total Bookings"
        value={stats?.totalBookings || 0}
      />

      <StatCard
        icon={Banknote}
        label="Total Revenue"
        value={`₦${(stats?.totalRevenue || 0).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`}
      />

      <StatCard
        icon={TrendingUp}
        label="Avg per Booking"
        value={`₦${avg}`}
      />

      <StatCard
        icon={Users}
        label="Workspace Types"
        value={stats?.byWorkspaceType?.length || 0}
      />
    </div>
  )
}
