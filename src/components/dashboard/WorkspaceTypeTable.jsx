import { COLORS } from "../../constants/colors"

export default function WorkspaceTypeTable({ data }) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 ">
        <h2 className="text-xl font-semibold text-black">
          Bookings by Workspace Type
        </h2>
      </div>

      <div className="p-6">
        {data?.length ? (
          <div className="space-y-4">
            {data.map((ws, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-900">{ws.workspaceType}</span>
                </div>
                <div className="text-right">
                  <div className="text-gray-100 font-semibold">{ws.count}</div>
                  <div className="text-sm text-gray-400">
                    ₦{(ws.revenue || 0).toLocaleString("en-NG")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No data available</p>
        )}
      </div>
    </div>
  )
}
