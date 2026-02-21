export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}
      </div>
    </div>
  )
}
