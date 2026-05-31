import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, Briefcase, Users, LogOut, Menu, X, ChevronRight } from 'lucide-react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'STAFF'] },
    { path: '/bookings', icon: Calendar, label: 'Bookings', roles: ['ADMIN', 'STAFF'] },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['ADMIN', 'STAFF'] },
    { path: '/workspace-types', icon: Briefcase, label: 'Workspace Types', roles: ['ADMIN'] },
    { path: '/staff', icon: Users, label: 'Staff Management', roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <button
        onClick={() => { navigate(item.path); setSidebarOpen(false); }}
        className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
          isActive
            ? 'bg-teal-500 text-white shadow-sm shadow-teal-200'
            : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
        }`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 stroke-[1.75] ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-teal-500'}`} />
        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
      </button>
    );
  };

  const currentPage = filteredNavItems.find(i => i.path === location.pathname);

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white border-r border-neutral-200">

      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-3.5 h-3.5 text-white stroke-[2]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-neutral-900 leading-none">Workspace</h1>
            <p className="text-[10px] text-teal-500 font-medium tracking-wide uppercase mt-0.5">Registry</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="mx-4 mb-5 p-3.5 rounded-xl bg-gradient-to-br from-teal-50 to-neutral-50 border border-teal-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <div className="truncate flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate leading-tight">{user.name}</p>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-teal-100/80 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isAdmin ? 'bg-teal-100 text-teal-700' : 'bg-neutral-100 text-neutral-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-teal-500' : 'bg-neutral-400'}`} />
            {user.role}
          </span>
          <span className="text-[10px] text-neutral-400">Active</span>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-6 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Navigation</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {filteredNavItems.map(item => <NavItem key={item.path} item={item} />)}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-2">
        <div className="border-t border-neutral-100 pt-4">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 stroke-[1.75] group-hover:text-red-500" />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50/80">

      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white stroke-[2]" />
          </div>
          <span className="text-sm font-semibold text-neutral-900">Workspace Registry</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar — desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[240px] lg:flex-col z-20">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-[240px] lg:hidden shadow-2xl">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <main className="lg:pl-[240px] min-h-screen">

        {/* Top bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {currentPage?.label ?? 'Dashboard'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{initials}</span>
              </div>
              <span className="text-xs font-medium text-neutral-700">{user.name}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}