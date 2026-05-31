import React from "react";
import { Calendar, TrendingUp, TrendingDown, Banknote, CreditCard, Star } from "lucide-react";

export default function StatsGrid({ bookings, expenses, userRole }) {
  const isHighValue = (b) => parseInt(b.duration, 10) > 30 || parseFloat(b.amountPaid) > 50000;

  const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.amountPaid) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const netIncome = totalRevenue - totalExpenses;
  const isProfit = netIncome >= 0;

  const stats = {
    total: bookings.length,
    highValue: bookings.filter(isHighValue).length,
    transfer: bookings.filter((b) => b.paymentMethod === "TRANSFER").length,
    pos: bookings.filter((b) => b.paymentMethod === "POS").length,
  };

  const baseCard = "bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col justify-between min-h-[120px] hover:shadow-sm transition-shadow duration-150";

  const StatCard = ({ label, value, icon: Icon, iconClass = "text-neutral-300", labelClass = "text-neutral-400", valueClass = "text-neutral-900", accent = false, children }) => (
    <div className={`${baseCard} ${accent ? "border-teal-200 bg-gradient-to-br from-teal-50/60 to-white" : ""}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[10px] font-semibold uppercase tracking-widest ${labelClass}`}>{label}</p>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent ? "bg-teal-100" : "bg-neutral-100"}`}>
          <Icon className={`w-3.5 h-3.5 stroke-[1.75] ${iconClass}`} />
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight leading-none ${valueClass}`}>{value}</p>
        {children}
      </div>
    </div>
  );

  const highValuePct = stats.total ? Math.round((stats.highValue / stats.total) * 100) : 0;
  const transferPct = stats.total ? Math.round((stats.transfer / stats.total) * 100) : 0;
  const posPct = stats.total ? Math.round((stats.pos / stats.total) * 100) : 0;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${userRole === "ADMIN" ? "lg:grid-cols-3 xl:grid-cols-6" : "lg:grid-cols-3 xl:grid-cols-5"} gap-3`}>

      {/* Total Bookings */}
      <StatCard
        label="Total Bookings"
        value={stats.total}
        icon={Calendar}
        iconClass="text-teal-500"
        labelClass="text-teal-600"
        valueClass="text-neutral-900"
        accent
      >
        <p className="text-[11px] text-neutral-400 mt-1">All time</p>
      </StatCard>

      {/* High Value */}
      <StatCard
        label="High-Value"
        value={stats.highValue}
        icon={Star}
        iconClass="text-neutral-500"
      >
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-neutral-400">{highValuePct}% of total</span>
          </div>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-300 rounded-full" style={{ width: `${highValuePct}%` }} />
          </div>
        </div>
      </StatCard>

      {/* Transfer */}
      <StatCard
        label="Transfer Vol"
        value={stats.transfer}
        icon={Banknote}
        iconClass="text-neutral-500"
      >
        <div className="mt-2">
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-300 rounded-full" style={{ width: `${transferPct}%` }} />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">{transferPct}% of bookings</p>
        </div>
      </StatCard>

      {/* POS */}
      <StatCard
        label="POS Vol"
        value={stats.pos}
        icon={CreditCard}
        iconClass="text-neutral-500"
      >
        <div className="mt-2">
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-400 rounded-full" style={{ width: `${posPct}%` }} />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">{posPct}% of bookings</p>
        </div>
      </StatCard>

      {/* Total Revenue */}
      <StatCard
        label="Total Revenue"
        value={`₦${totalRevenue.toLocaleString("en-NG")}`}
        icon={TrendingUp}
        iconClass="text-teal-500"
        labelClass="text-teal-600"
        valueClass="text-teal-600 text-xl"
        accent
      >
        <p className="text-[11px] text-teal-400 mt-1">Gross earnings</p>
      </StatCard>

      {/* Net Income — Admin only */}
      {userRole === "ADMIN" && (
        <div className={`${baseCard} ${isProfit ? "border-teal-200 bg-gradient-to-br from-teal-50/40 to-white" : "border-red-200 bg-gradient-to-br from-red-50/40 to-white"}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${isProfit ? "text-teal-600" : "text-red-500"}`}>
              Net Income
            </p>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isProfit ? "bg-teal-100" : "bg-red-100"}`}>
              {isProfit
                ? <TrendingUp className="w-3.5 h-3.5 text-teal-500 stroke-[1.75]" />
                : <TrendingDown className="w-3.5 h-3.5 text-red-400 stroke-[1.75]" />
              }
            </div>
          </div>
          <div>
            <p className={`text-xl font-bold tracking-tight leading-none ${isProfit ? "text-teal-600" : "text-red-500"}`}>
              ₦{Math.abs(netIncome).toLocaleString("en-NG")}
            </p>
            <p className={`text-[11px] mt-1 ${isProfit ? "text-teal-400" : "text-red-400"}`}>
              {isProfit ? "After expenses" : `₦${totalExpenses.toLocaleString("en-NG")} in expenses`}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}