import { Download } from "lucide-react"

export default function FinanceHeader({ onExport }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <p className="text-gray-600 mt-1">Track bookings and expenses</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onExport("csv")}
          className="flex items-center gap-2 bg-green-600 text-white px-8 py-2  rounded-lg"
        >
          <Download className="w-5 h-5" /> CSV
        </button>
        <button
          onClick={() => onExport("json")}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          <Download className="w-5 h-5" /> JSON
        </button>
      </div>
    </div>
  )
}
