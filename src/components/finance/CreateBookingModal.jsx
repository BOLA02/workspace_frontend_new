"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"


const API_URL = import.meta.env.VITE_API_URL;

export default function CreateBookingModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    customerName: "",
    workspaceType: "",
    startTime: "",
    endTime: "",
    amountPaid: "",
    paymentMethod: "POS",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to create booking")
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Create Booking</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            name="customerName"
            placeholder="Customer Name"
            className="w-full input"
            onChange={handleChange}
            required
          />

          <input
            name="workspaceType"
            placeholder="Workspace Type"
            className="w-full input"
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              name="startTime"
              className="input"
              onChange={handleChange}
              required
            />
            <input
              type="datetime-local"
              name="endTime"
              className="input"
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="number"
            name="amountPaid"
            placeholder="Amount Paid"
            className="input"
            onChange={handleChange}
            required
          />

          <select
            name="paymentMethod"
            className="input"
            onChange={handleChange}
          >
            
            <option value="TRANSFER">Transfer</option>
            <option value="POS">POS</option>
          </select>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
