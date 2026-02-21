export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-3">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-2xl font-bold text-slate-100">
        {value}
      </div>
    </div>
  )
}
