import { COLORS } from "../../constants/colors";
import { Layers } from "lucide-react";

export default function WorkspaceTypeTable({ data }) {
  const total = data?.reduce((sum, ws) => sum + (ws.count || 0), 0) || 0;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
          <Layers className="w-4 h-4 text-teal-500 stroke-[1.75]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Bookings by Workspace Type</h2>
          <p className="text-xs text-neutral-400 mt-0.5">{total} total bookings across all types</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {data?.length ? (
          <div className="space-y-3">
            {data.map((ws, index) => {
              const pct = total ? Math.round((ws.count / total) * 100) : 0;
              const color = COLORS[index % COLORS.length];

              return (
                <div key={index} className="group">
                  {/* Row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium text-neutral-700">{ws.workspaceType}</span>
                      <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                        {pct}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-neutral-800">{ws.count}</span>
                      <span className="text-xs text-neutral-400 ml-2">
                        ₦{(ws.revenue || 0).toLocaleString("en-NG")}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5 text-neutral-300 stroke-[1.5]" />
            </div>
            <p className="text-sm font-medium text-neutral-400">No data available</p>
            <p className="text-xs text-neutral-300 mt-1">Bookings will appear here once created</p>
          </div>
        )}
      </div>
    </div>
  );
}