import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Users, Banknote } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const COLORS = ['#14b8a6', '#0d9488', '#5eead4', '#6b7280', '#374151', '#9ca3af'];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/analytics/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 bg-white">
        <p className="text-xs uppercase tracking-widest text-gray-400">No analytics data available</p>
      </div>
    );
  }

  const paymentData = stats.byPaymentMethod?.map(item => ({
    name: item.paymentMethod,
    count: item._count,
    revenue: item._sum.amountPaid || 0
  })) || [];

  const workspaceData = stats.byWorkspaceType?.map(item => ({
    name: item.workspaceType,
    count: item.count,
    revenue: item.revenue || 0
  })) || [];

  const avgBookingValue = stats.totalBookings > 0
    ? (stats.totalRevenue / stats.totalBookings).toFixed(2)
    : '0.00';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-md shadow-sm px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs font-semibold text-gray-900">
              {p.name}: {p.name.includes('Revenue') ? `₦${p.value.toLocaleString()}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white w-full" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <div className="w-full px-6 py-6 space-y-6">

        {/* Header */}
        <header>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
              Workspace Registry
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-xs text-gray-400 mt-0.5">Performance insights & revenue breakdown</p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="border border-gray-100 rounded-lg p-5 bg-white hover:border-teal-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-teal-500" />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-gray-300" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Total Bookings</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings || 0}</p>
          </div>

          <div className="border border-gray-100 rounded-lg p-5 bg-white hover:border-teal-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center">
                <Banknote className="w-4 h-4 text-teal-500" />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-gray-300" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">₦{stats.totalRevenue?.toLocaleString() || '0'}</p>
          </div>

          <div className="border border-gray-100 rounded-lg p-5 bg-white hover:border-teal-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-teal-500" />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-gray-300" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Avg Booking Value</p>
            <p className="text-2xl font-semibold text-gray-900">₦{Number(avgBookingValue).toLocaleString()}</p>
          </div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Pie Chart */}
          <div className="border border-gray-100 rounded-lg p-5 bg-white">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Distribution</p>
              <h2 className="text-sm font-semibold text-gray-900 mt-0.5">Bookings by Workspace</h2>
            </div>
            {workspaceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={workspaceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name}: ${count}`}
                    outerRadius={90}
                    dataKey="count"
                    stroke="none"
                  >
                    {workspaceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-xs text-gray-400 uppercase tracking-widest">No data available</p>
              </div>
            )}
          </div>

          {/* Bar Chart — Payment Methods */}
          <div className="border border-gray-100 rounded-lg p-5 bg-white">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Revenue</p>
              <h2 className="text-sm font-semibold text-gray-900 mt-0.5">Payment Methods</h2>
            </div>
            {paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={paymentData} barSize={32}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdfa' }} />
                  <Bar dataKey="revenue" fill="#14b8a6" name="Revenue (₦)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-xs text-gray-400 uppercase tracking-widest">No data available</p>
              </div>
            )}
          </div>

          {/* Bar Chart — Workspace Revenue */}
          <div className="border border-gray-100 rounded-lg p-5 bg-white">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Revenue</p>
              <h2 className="text-sm font-semibold text-gray-900 mt-0.5">By Workspace Type</h2>
            </div>
            {workspaceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={workspaceData} barSize={32}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdfa' }} />
                  <Bar dataKey="revenue" fill="#0d9488" name="Revenue (₦)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-xs text-gray-400 uppercase tracking-widest">No data available</p>
              </div>
            )}
          </div>

          {/* Payment Method Breakdown List */}
          <div className="border border-gray-100 rounded-lg p-5 bg-white">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Breakdown</p>
              <h2 className="text-sm font-semibold text-gray-900 mt-0.5">Revenue by Payment Method</h2>
            </div>
            {paymentData.length > 0 ? (
              <div className="space-y-3 pt-1">
                {paymentData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">₦{item.revenue.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.count} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-xs text-gray-400 uppercase tracking-widest">No data available</p>
              </div>
            )}
          </div>

        </div>

        {/* Top Workspaces Table */}
        <div className="border border-gray-100 rounded-lg bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Performance</p>
            <h2 className="text-sm font-semibold text-gray-900 mt-0.5">Top Performing Workspaces</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/60">
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400">Workspace</th>
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400">Bookings</th>
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400">Revenue</th>
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400">Avg Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {workspaceData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{item.count}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">₦{item.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      ₦{(item.revenue / item.count).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {workspaceData.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xs text-gray-400 uppercase tracking-widest">No workspace data available</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}