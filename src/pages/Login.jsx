import { useState } from "react"
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  const handleLogin = async (e) => {
    e?.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Login failed")

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      window.location.href = "/dashboard"

    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-stretch" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* Left panel — photo */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        {/* Photo */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
          alt="Modern coworking office"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

        {/* Content over image */}
        <div className="relative h-full flex flex-col justify-between p-10 z-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-xs font-medium tracking-widest uppercase text-white/80">
              Workspace Registry
            </span>
          </div>

          {/* Bottom text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span className="text-[10px] uppercase tracking-widest text-white/70">All in one place</span>
            </div>
            <h2 className="text-2xl font-semibold text-white leading-snug mb-2">
              Manage your workspace<br />bookings effortlessly
            </h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Book desks, meeting rooms, and shared spaces — track revenue and manage your team.
            </p>
          </div>

          <p className="text-xs text-white/30">© 2026 Workspace Registry — Kameel Bolatito</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
              Workspace Registry
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-semibold text-gray-900 mb-1 tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-400">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md mb-5">
              <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-md text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 disabled:opacity-50 transition-all bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-md text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 disabled:opacity-50 transition-all bg-white"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-300 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <a href="#" className="text-teal-600 hover:underline">
              Request access
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}