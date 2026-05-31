import React, { useState } from "react";
import { Download, FileText, FileJson, ChevronDown } from "lucide-react";

export default function ExportControls({ onExport }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(null);

  const handleExport = async (type) => {
    setExporting(type);
    setOpen(false);
    await onExport(type);
    setTimeout(() => setExporting(null), 1500);
  };

  const options = [
    { type: "csv", icon: FileText, label: "Export as CSV", sub: "Spreadsheet format" },
    { type: "json", icon: FileJson, label: "Export as JSON", sub: "Raw data format" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 hover:border-teal-300 hover:bg-teal-50/40 text-neutral-700 hover:text-teal-600 rounded-xl text-sm font-medium transition-all duration-150 shadow-sm"
      >
        {exporting ? (
          <span className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download className="w-4 h-4 stroke-[1.75]" />
        )}
        <span>{exporting ? "Exporting..." : "Export"}</span>
        <ChevronDown className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 overflow-hidden">
            <div className="px-3 py-2 border-b border-neutral-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Choose format</p>
            </div>
            {options.map(({ type, icon: Icon, label, sub }) => (
              <button
                key={type}
                onClick={() => handleExport(type)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-teal-50 group transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-neutral-100 group-hover:bg-teal-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-teal-500 stroke-[1.75] transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-700 group-hover:text-teal-700">{label}</p>
                  <p className="text-[11px] text-neutral-400">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}