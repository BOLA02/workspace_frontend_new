import React from "react";

export default function BookingModal({ isOpen, onClose, formData, setFormData, workspaceTypes, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight">New Booking</h2>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Customer Name <span className="text-teal-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName || ""}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Full name"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Phone Number <span className="text-teal-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber || ""}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+234..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Workspace Type <span className="text-teal-500">*</span>
              </label>
              <select
                value={formData.workspaceTypeId || ""}
                onChange={(e) => setFormData({ ...formData, workspaceTypeId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 transition-all cursor-pointer appearance-none"
              >
                <option value="">Select workspace type</option>
                {workspaceTypes.filter(ws => ws.isActive).map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.name} (Capacity: {ws.capacity})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Start Date <span className="text-teal-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Duration <span className="text-teal-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={formData.duration || "1"}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-16 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 text-center transition-all"
                />
                <select
                  value={formData.durationType || "DAYS"}
                  onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 transition-all cursor-pointer appearance-none"
                >
                  <option value="DAYS">Days</option>
                  <option value="MONTHS">Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Amount Paid (₦) <span className="text-teal-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amountPaid || ""}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Payment Method <span className="text-teal-500">*</span>
              </label>
              <select
                value={formData.paymentMethod || "TRANSFER"}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 transition-all cursor-pointer appearance-none"
              >
                <option value="TRANSFER">Transfer</option>
                <option value="POS">POS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-2.5 text-xs font-medium bg-teal-500 text-white rounded-md hover:bg-teal-600 active:bg-teal-700 transition-colors tracking-wide"
          >
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
}