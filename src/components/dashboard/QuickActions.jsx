import { Calendar, Briefcase, BarChart3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    icon: Calendar,
    label: "View All Bookings",
    description: "Browse and manage reservations",
    path: "/bookings",
    accent: true,
  },
  {
    icon: Briefcase,
    label: "Manage Workspace Types",
    description: "Configure spaces and pricing",
    path: "/workspace-types",
  },
  {
    icon: BarChart3,
    label: "View Analytics",
    description: "Track revenue and trends",
    path: "/analytics",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-neutral-900">Quick Actions</h2>
        <p className="text-xs text-neutral-400 mt-0.5">Jump to a section</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map(({ icon: Icon, label, description, path, accent }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`group flex flex-col gap-3 p-4 rounded-xl border text-left transition-all duration-150 hover:shadow-sm ${
              accent
                ? "bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600"
                : "bg-white border-neutral-200 hover:border-teal-200 hover:bg-teal-50/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                accent ? "bg-white/20" : "bg-neutral-100 group-hover:bg-teal-100"
              }`}>
                <Icon className={`w-4 h-4 stroke-[1.75] ${
                  accent ? "text-white" : "text-neutral-500 group-hover:text-teal-500"
                }`} />
              </div>
              <ArrowRight className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 ${
                accent ? "text-white" : "text-teal-500"
              }`} />
            </div>

            <div>
              <p className={`text-sm font-semibold leading-tight ${
                accent ? "text-white" : "text-neutral-800"
              }`}>
                {label}
              </p>
              <p className={`text-xs mt-0.5 ${
                accent ? "text-white/70" : "text-neutral-400"
              }`}>
                {description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}