import { Calendar, Banknote, TrendingUp, TrendingDown } from "lucide-react"

export default function FinanceStats({ stats, isAdmin }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Stat label="Total Bookings" value={stats.total} icon={Calendar} />

      <Stat
        label="Transfer"
        value={`${stats.transfer.toLocaleString()}`}
        icon={Banknote}
        color="purple"
      />

      <Stat
        label="POS"
        value={`${stats.pos.toLocaleString()}`}
        icon={Banknote}
        color="orange"
      />

      <Stat
        label="Total Revenue"
        value={`₦${stats.totalRevenue.toLocaleString()}`}
        icon={TrendingUp}
        gradient
      />

      {isAdmin && (
        <Stat
          label="Net Income"
          value={`₦${stats.netIncome.toLocaleString()}`}
          icon={stats.netIncome >= 0 ? TrendingUp : TrendingDown}
          gradient
          danger={stats.netIncome < 0}
        />
      )}
    </div>
  )
}

function Stat({ label, value, icon: Icon, gradient, danger }) {
  return (
    <div
      className={`p-6 rounded-lg shadow ${
        gradient
          ? danger
            ? "bg-red-600 text-white"
            : "bg-blue-600 text-white"
          : "bg-white"
      }`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm opacity-80">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="w-8 h-8 opacity-80" />
      </div>
    </div>
  )
}
