import { Sparkles } from "lucide-react";

export default function DashboardHeader() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-teal-500 stroke-[1.75]" />
          <span className="text-xs font-medium text-teal-500 uppercase tracking-widest">
            {today}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900 leading-snug">
          {getGreeting()},{" "}
          <span className="text-teal-500">{user.name?.split(" ")[0] ?? "there"}</span> 👋
        </h1>
        <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
          Here's what's happening across your workspaces today.
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span className="text-xs font-medium text-teal-600">Live overview</span>
      </div>
    </div>
  );
}