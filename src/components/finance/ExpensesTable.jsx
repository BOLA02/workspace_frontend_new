import { Trash2 } from "lucide-react"

export default function ExpensesTable({ expenses, onDelete }) {
  if (!expenses.length) {
    return <p className="text-center py-10 text-gray-500">No expenses recorded</p>
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3">Description</th>
          <th className="px-6 py-3">Category</th>
          <th className="px-6 py-3">Amount</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {expenses.map(e => (
          <tr key={e.id}>
            <td className="px-6 py-4">{e.description}</td>
            <td className="px-6 py-4">{e.category}</td>
            <td className="px-6 py-4 text-red-600">
              ₦{e.amount.toLocaleString()}
            </td>
            <td className="px-6 py-4">
              <button onClick={() => onDelete(e.id)}>
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
