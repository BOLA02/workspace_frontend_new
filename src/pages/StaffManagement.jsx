import { useState } from "react";
import { UserPlus, Mail, Lock, User, Shield, Info } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffManagement() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }
    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: `Staff member ${data.user.name} created successfully!` });
        setFormData({ name: "", email: "", password: "", role: "STAFF" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create staff member" });
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all";
  const labelClass = "block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5";

  return (
    <div className="min-h-screen bg-white w-full" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <div className="w-full px-6 py-6 space-y-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                Workspace Registry
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Staff Management</h1>
            <p className="text-xs text-gray-400 mt-0.5">Create staff and admin accounts</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 border border-teal-100 bg-teal-50 rounded-md">
            <Shield className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-[10px] uppercase tracking-widest text-teal-600 font-medium">Admin Only</span>
          </div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Form — spans 2 cols */}
          <div className="lg:col-span-2 border border-gray-100 rounded-lg bg-white overflow-hidden">

            {/* Form Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-teal-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Register New Staff</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Create a new staff or admin account securely</p>
              </div>
            </div>

            {/* Message Banner */}
            {message.text && (
              <div className={`mx-6 mt-4 px-4 py-3 rounded-md border text-xs font-medium ${
                message.type === "success"
                  ? "bg-teal-50 text-teal-700 border-teal-100"
                  : "bg-red-50 text-red-600 border-red-100"
              }`}>
                {message.text}
              </div>
            )}

            {/* Form Fields */}
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Full Name <span className="text-teal-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email Address <span className="text-teal-500">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Password <span className="text-teal-500">*</span>
                  </span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className={inputClass}
                />
                <p className="text-[10px] text-gray-400 mt-1.5">Password must be at least 6 characters long</p>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3" /> Role <span className="text-teal-500">*</span>
                  </span>
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={inputClass + " cursor-pointer appearance-none"}
                >
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Staff can create bookings. Admins have full access including user management.
                </p>
              </div>
            </div>

            {/* Form Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-2.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <div className="flex gap-1">
                      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Register Staff Member
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notes Panel */}
          <div className="lg:col-span-1 border border-gray-100 rounded-lg bg-white overflow-hidden lg:self-start">

            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center">
                <Info className="w-4 h-4 text-teal-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Important Notes</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Role permissions & guidelines</p>
              </div>
            </div>

            <ul className="px-5 py-4 space-y-3">
              {[
                "Staff members can create and view their own bookings.",
                "Admins can create bookings, manage workspace types, and register new users.",
                "Email addresses must be unique across all users.",
                "Passwords are securely hashed before storage.",
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span className="text-xs text-gray-600 leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>

            <div className="mx-5 mb-5 px-4 py-3 bg-teal-50 border border-teal-100 rounded-md">
              <p className="text-[10px] text-teal-700 leading-relaxed">
                Tip: Use a strong password for admin accounts and store it securely.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}