import React from "react";
import { Phone, Clock, Calendar, Trash2, Edit } from "lucide-react";

export default function BookingsTable({ data, userRole, onDeleteBooking, onEditBooking }) {

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-neutral-200 rounded-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
          <Calendar className="w-5 h-5 text-neutral-300 stroke-[1.5]" />
        </div>
        <p className="text-sm font-semibold text-neutral-400">No bookings found</p>
        <p className="text-xs text-neutral-300 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">

          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/70">
              {["Customer", "Phone", "Workspace", "Date", "Duration", "Amount", "Payment", "Staff", userRole === "ADMIN" ? "" : null].filter(h => h !== null).map((h, i) => (
                <th key={i} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 whitespace-nowrap ${h === "" ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {data.map((booking) => (
              <tr
                key={booking.id}
                className="group transition-colors hover:bg-neutral-50/80"
              >

                {/* Customer */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                      {initials(booking.customerName)}
                    </div>
                    <p className="font-semibold text-neutral-800 text-sm leading-tight">{booking.customerName}</p>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Phone className="w-3.5 h-3.5 text-neutral-300 stroke-[1.75] flex-shrink-0" />
                    <span className="text-sm">{booking.customerPhone || "—"}</span>
                  </div>
                </td>

                {/* Workspace */}
                <td className="px-5 py-4">
                  <span className="inline-block text-xs font-medium text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg">
                    {booking.workspaceType?.name || "—"}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="w-3.5 h-3.5 text-neutral-300 stroke-[1.75] flex-shrink-0" />
                    <span className="text-sm tabular-nums">
                      {booking.usageDate
                        ? new Date(booking.usageDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </span>
                  </div>
                </td>

                {/* Duration */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-3.5 h-3.5 text-neutral-300 stroke-[1.75] flex-shrink-0" />
                    <span className="text-sm tabular-nums">{booking.duration}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-5 py-4">
                  <span className="text-sm font-bold tabular-nums text-neutral-800">
                    ₦{parseFloat(booking.amountPaid || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </td>

                {/* Payment method */}
                <td className="px-5 py-4">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    booking.paymentMethod === "TRANSFER"
                      ? "bg-teal-50 text-teal-600 border-teal-200"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  }`}>
                    {booking.paymentMethod}
                  </span>
                </td>

                {/* Staff */}
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-neutral-700 leading-tight">{booking.staff?.name || "Unassigned"}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5 truncate max-w-[120px]">{booking.staff?.email || ""}</p>
                </td>

                {/* Actions */}
                {userRole === "ADMIN" && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => onEditBooking(booking)}
                        title="Edit Booking"
                        className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5 stroke-[1.75]" />
                      </button>
                      <button
                        onClick={() => onDeleteBooking(booking.id)}
                        title="Delete Booking"
                        className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                      </button>
                    </div>
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}