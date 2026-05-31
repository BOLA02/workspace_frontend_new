import React from "react";
import { FileText, Trash2, Edit, Calendar } from "lucide-react";

export default function ExpensesTable({ expenses, onDelete, onEditExpense }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-neutral-200 rounded-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
          <FileText className="w-5 h-5 text-neutral-300 stroke-[1.5]" />
        </div>
        <p className="text-sm font-semibold text-neutral-400">No expenses recorded</p>
        <p className="text-xs text-neutral-300 mt-1">Expenses will appear here once added</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">

          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/70">
              {["Description", "Category", "Amount", "Date", ""].map((h, i) => (
                <th key={i} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 whitespace-nowrap ${h === "" ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="group transition-colors hover:bg-neutral-50/80">

                {/* Description */}
                <td className="px-5 py-4 max-w-[240px]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 text-neutral-400 stroke-[1.75]" />
                    </div>
                    <p className="text-sm font-medium text-neutral-800 truncate">{expense.description}</p>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200">
                    {expense.category || "General"}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-5 py-4">
                  <span className="text-sm font-bold tabular-nums text-neutral-800">
                    ₦{parseFloat(expense.amount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="w-3.5 h-3.5 text-neutral-300 stroke-[1.75] flex-shrink-0" />
                    <span className="text-sm tabular-nums">
                      {expense.expenseDate
                        ? new Date(expense.expenseDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => onEditExpense(expense)}
                      title="Edit"
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5 stroke-[1.75]" />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      title="Delete"
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}