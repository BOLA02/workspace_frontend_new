export default function FinanceTabs({ activeTab, setActiveTab, isAdmin }) {
  return (
    <nav className="flex ">
      <Tab label="Bookings (Inflow)" active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} />
      {isAdmin && (
        <Tab label="Expenses (Outflow)" active={activeTab === "expenses"} onClick={() => setActiveTab("expenses")} />
      )}
    </nav>
  )
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-sm font-medium ${
        active ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
      }`}
    >
      {label}
    </button>
  )
}
