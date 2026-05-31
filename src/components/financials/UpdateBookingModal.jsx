import React, { useEffect, useState } from "react";

export default function UpdateBookingModal({ isOpen, onClose, booking, workspaceTypes, onUpdate }) {
  const [formData, setFormData] = useState({
    customerName: "",
    amountPaid: "",
    paymentMethod: "TRANSFER",
    usageDate: "",
    workspaceTypeId: ""
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        customerName: booking.customerName || "",
        amountPaid: booking.amountPaid || "",
        paymentMethod: booking.paymentMethod || "TRANSFER",
        usageDate: booking.usageDate ? new Date(booking.usageDate).toISOString().split("T")[0] : "",
        workspaceTypeId: booking.workspaceTypeId || ""
      });
    }
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.amountPaid || !formData.usageDate || !formData.workspaceTypeId) {
      alert("Please fill all required fields");
      return;
    }
    onUpdate(booking.id, formData);
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all";
  const labelClass = "block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Edit Booking</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">

            <div>
              <label className={labelClass}>Customer Name <span className="text-teal-500">*</span></label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Workspace Type <span className="text-teal-500">*</span></label>
              <select
                value={formData.workspaceTypeId}
                onChange={(e) => setFormData({ ...formData, workspaceTypeId: e.target.value })}
                className={inputClass + " cursor-pointer appearance-none"}
              >
                <option value="">Select workspace type</option>
                {workspaceTypes.map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Amount Paid (₦) <span className="text-teal-500">*</span></label>
                <input
                  type="number"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Payment Method <span className="text-teal-500">*</span></label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className={inputClass + " cursor-pointer appearance-none"}
                >
                  <option value="TRANSFER">Transfer</option>
                  <option value="POS">POS</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Usage Date <span className="text-teal-500">*</span></label>
              <input
                type="date"
                value={formData.usageDate}
                onChange={(e) => setFormData({ ...formData, usageDate: e.target.value })}
                className={inputClass + " cursor-pointer"}
              />
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
              type="submit"
              className="flex-1 py-2.5 text-xs font-medium bg-teal-500 text-white rounded-md hover:bg-teal-600 active:bg-teal-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}