import React from "react";
import { useFinancials } from "../components/financials/useFinancials";
import StatsGrid from "../components/financials/StatsGrid";
import FilterBar from "../components/financials/FilterBar";
import BookingsTable from "../components/financials/BookingsTable";
import ExpenseModal from "../components/financials/ExpenseModal";
import BookingModal from "../components/financials/BookingModal";
import ExpensesTable from "../components/financials/ExpensesTable";
import UpdateBookingModal from "../components/financials/UpdateBookingModal";
import UpdateExpenseModal from "../components/financials/UpdateExpenseModal";
import ExportControls from "../components/financials/ExportControls";

export default function BookingsAndExpenses() {
  const fHook = useFinancials();

  if (fHook.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 w-full" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      <div className="w-full px-6 py-6 space-y-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            
            
            <p className="text-bold text-gray-400 mt-0.5">Inflow & Outflow Management</p>
          </div>

          <div className="shrink-0">
            {fHook.activeTab === "bookings" ? (
              <ExportControls onExport={(format) => fHook.exportBookings(format)} />
            ) : (
              <ExportControls onExport={(format) => fHook.exportExpenses(format)} />
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <section>
          <StatsGrid
            bookings={fHook.filteredBookings}
            expenses={fHook.expenses}
            userRole={fHook.userRole}
          />
        </section>

        {/* Main Card */}
        <div className="border border-gray-100 bg-white shadow-sm rounded-lg overflow-hidden w-full">

          {/* Tab Bar */}
          <div className="flex border-b border-gray-100 bg-gray-50/60">
            <button
              onClick={() => fHook.setActiveTab("bookings")}
              className={`relative px-6 py-3 text-xs font-medium uppercase tracking-widest transition-all duration-200 ${
                fHook.activeTab === "bookings"
                  ? "text-teal-600 bg-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Bookings
              {fHook.activeTab === "bookings" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
              )}
            </button>

            {fHook.userRole === "ADMIN" && (
              <button
                onClick={() => fHook.setActiveTab("expenses")}
                className={`relative px-6 py-3 text-xs font-medium uppercase tracking-widest transition-all duration-200 ${
                  fHook.activeTab === "expenses"
                    ? "text-teal-600 bg-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Expenses
                {fHook.activeTab === "expenses" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
                )}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {fHook.activeTab === "bookings" ? (
              <div className="space-y-4">
                <FilterBar
                  {...fHook}
                  onNewBookingClick={() => fHook.setShowCreateModal(true)}
                />

                <BookingsTable
                  data={fHook.filteredBookings}
                  userRole={fHook.userRole}
                  onDeleteBooking={fHook.handleDeleteBooking}
                  onEditBooking={fHook.openUpdateModal}
                />

                {/* Pagination */}
                {fHook.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      Page{" "}
                      <span className="text-gray-700 font-medium">{fHook.currentPage}</span>
                      {" "}of{" "}
                      <span className="text-gray-700 font-medium">{fHook.totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={fHook.currentPage === 1}
                        onClick={() => fHook.setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 bg-white hover:border-teal-400 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded"
                      >
                        Prev
                      </button>
                      <button
                        disabled={fHook.currentPage === fHook.totalPages}
                        onClick={() => fHook.setCurrentPage((p) => Math.min(p + 1, fHook.totalPages))}
                        className="px-3 py-1.5 text-xs font-medium bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Expense Records</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Track operational outflow</p>
                  </div>
                  <button
                    onClick={() => fHook.setShowExpenseModal(true)}
                    className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 text-xs font-medium tracking-wide rounded transition-colors"
                  >
                    <span className="text-sm leading-none">+</span>
                    Add Expense
                  </button>
                </div>

                <ExpensesTable
                  expenses={fHook.expenses}
                  onEditExpense={fHook.openUpdateExpenseModal}
                  onDelete={async (id) => {
                    if (confirm("Delete this expense record?")) {
                      const token = localStorage.getItem("token");
                      await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      fHook.fetchExpenses();
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={fHook.showCreateModal}
        onClose={() => fHook.setShowCreateModal(false)}
        formData={fHook.bookingFormData}
        setFormData={fHook.setBookingFormData}
        workspaceTypes={fHook.workspaceTypes}
        onSubmit={fHook.handleBookingSubmit}
      />

      <ExpenseModal
        isOpen={fHook.showExpenseModal}
        onClose={() => fHook.setShowExpenseModal(false)}
        formData={fHook.expenseFormData}
        setFormData={fHook.setExpenseFormData}
        onSubmit={fHook.handleExpenseSubmit}
      />

      <UpdateBookingModal
        isOpen={!!fHook.selectedBookingForUpdate}
        onClose={() => fHook.setSelectedBookingForUpdate(null)}
        booking={fHook.selectedBookingForUpdate}
        workspaceTypes={fHook.workspaceTypes}
        onUpdate={fHook.handleBookingUpdate}
      />

      <UpdateExpenseModal
        isOpen={!!fHook.selectedExpenseForUpdate}
        onClose={() => fHook.setSelectedExpenseForUpdate(null)}
        expense={fHook.selectedExpenseForUpdate}
        onUpdate={fHook.handleExpenseUpdate}
      />
    </div>
  );
}