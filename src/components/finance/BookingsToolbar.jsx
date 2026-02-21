import { Search, Filter, Plus } from "lucide-react"

export default function BookingsToolbar({
  searchTerm,
  setSearchTerm,
  paymentFilter,
  setPaymentFilter,
  onCreate,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search customer..."
          className="w-full pl-10 py-2 bg-gray-50 rounded-lg"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="ALL">All</option>
          <option value="TRANSFER">Transfer</option>
          <option value="POS">POS</option>
        </select>
      </div>

      <button
        onClick={onCreate}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        <Plus className="w-5 h-5" /> New Booking
      </button>
    </div>
  )
}
