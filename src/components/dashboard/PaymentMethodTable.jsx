import { COLORS } from "../../constants/colors"

export default function PaymentMethodTable({ data }) {
  return (
    <div className="bg-white  rounded-lg shadow">
      <div className="p-6 ">
        <h2 className="text-xl font-semibold text-gray-900">
          Bookings by Payment Method
        </h2>
      </div>

      <div className="p-6">
        {data?.length ? (
          <div className="space-y-4">
            {data.map((pm, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-900">{pm.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">{pm._count}</div>
                  <div className="text-sm text-gray-900">
                    ₦{(pm._sum?.amountPaid || 0).toLocaleString("en-NG")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No data available</p>
        )}
      </div>
    </div>
  )
}
