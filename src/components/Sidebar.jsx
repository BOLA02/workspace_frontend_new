import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser, logout } from "../auth/auth";
import { LayoutDashboard, Calendar, Layers, BarChart3, LogOut, User } from "lucide-react";

export default function Sidebar() {
  const user = getUser();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLink = (to, Icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-150 ${
        isActive(to)
          ? "text-[#0d9373] bg-[#0d9373]/10"
          : "text-neutral-500 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon
        className={`w-4 h-4 stroke-[1.5] flex-shrink-0 ${
          isActive(to) ? "text-[#0d9373]" : ""
        }`}
      />
      {label}
    </Link>
  );

  return (
    <div className="w-[210px] h-screen bg-[#0a0a0a] flex flex-col justify-between fixed left-0 top-0 border-r border-white/[0.06]">

      {/* Top */}
      <div>

        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-sm bg-[#0d9373] flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              Registry
            </span>
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0d9373]/15 border border-[#0d9373]/30 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-[#0d9373] stroke-[1.5]" />
            </div>
            <div className="truncate min-w-0">
              <p className="text-[12px] font-medium text-white truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#0d9373] uppercase tracking-wider font-medium mt-0.5">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="py-3">
          {navLink("/dashboard", LayoutDashboard, "Dashboard")}
          {navLink("/bookings", Calendar, "Bookings")}
          {user.role === "ADMIN" && (
            <>
              {navLink("/workspace-types", Layers, "Workspaces")}
              {navLink("/analytics", BarChart3, "Analytics")}
            </>
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-white/[0.06]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 hover:text-red-400 transition-colors duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4 stroke-[1.5] flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}