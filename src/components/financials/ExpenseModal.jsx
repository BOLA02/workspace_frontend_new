import React from "react";

export default function ExpenseModal({ isOpen, onClose, formData, setFormData, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-lg shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Add Expense</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
              Description <span className="text-teal-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Office Internet Station Renewal"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
              Category <span className="text-teal-500">*</span>
            </label>
            <select
              required
              value={formData.category || "GENERAL"}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 transition-all cursor-pointer appearance-none"
            >
              <option value="GENERAL">General Office Operations</option>
              <option value="UTILITIES">Utilities (Power/Data)</option>
              <option value="MAINTENANCE">Maintenance & Repairs</option>
              <option value="SALARIES">Salaries & Compensation</option>
              <option value="MARKETING">Marketing & Advertisements</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Amount (₦) <span className="text-teal-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Expense Date <span className="text-teal-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.expenseDate || ""}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 transition-all"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 py-2.5 text-xs font-medium bg-teal-500 text-white rounded-md hover:bg-teal-600 active:bg-teal-700 transition-colors tracking-wide"
          >
            Add Expense
          </button>
        </div>

      </div>
    </div>
  );
}