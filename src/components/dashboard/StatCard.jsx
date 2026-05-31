// StatCard.jsx
export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className={`relative bg-white rounded-2xl border p-5 flex flex-col gap-4 overflow-hidden transition-shadow hover:shadow-md ${
      accent ? "border-teal-200" : "border-neutral-200"
    }`}>
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 to-white pointer-events-none" />
      )}

      <div className="relative flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          accent ? "bg-teal-500" : "bg-neutral-100"
        }`}>
          <Icon className={`w-4 h-4 stroke-[1.75] ${accent ? "text-white" : "text-neutral-500"}`} />
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${
          accent ? "bg-teal-50 text-teal-600" : "bg-neutral-100 text-neutral-400"
        }`}>
          Today
        </span>
      </div>

      <div className="relative">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-2xl font-bold tracking-tight ${accent ? "text-teal-600" : "text-neutral-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}