export default function QuickActions() {
  return (
    <div className="mt-8 bg-white-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => (window.location.href = "/bookings")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View All Bookings
        </button>

        <button
          onClick={() => (window.location.href = "/workspace-types")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Manage Workspace Types
        </button>

        <button
          onClick={() => (window.location.href = "/analytics")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          View Analytics
        </button>
      </div>
    </div>
  )
}
