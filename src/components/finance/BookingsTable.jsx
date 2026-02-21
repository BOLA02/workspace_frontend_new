import { Calendar, User } from "lucide-react"

export default function BookingsTable({ bookings }) {
  if (!bookings.length) {
    return <p className="text-center py-10 text-gray-500">No bookings found</p>
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left">Customer</th>
          <th className="px-4 py-3">Workspace</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Amount</th>
          <th className="px-4 py-3">Payment</th>
        </tr>
      </thead>
      <tbody className="">
        {bookings.map(b => (
          <tr key={b.id}>
            <td className="px-6 py-4 flex gap-2 items-center">
              <User className="w-4 h-4" /> {b.customerName}
            </td>
            <td className="px-6 py-4">{b.workspaceType?.name}</td>
            <td className="px-6 py-4 flex gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(b.usageDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-green-600">
              ₦{b.amountPaid.toLocaleString()}
            </td>
            <td className="px-6 py-4">{b.paymentMethod}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
