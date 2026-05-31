import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, X, SlidersHorizontal, ChevronDown, Calendar } from "lucide-react";

export default function FilterBar({
  searchTerm, setSearchTerm, startDateFilter, setStartDateFilter,
  endDateFilter, setEndDateFilter, workspaceFilter, setWorkspaceFilter,
  paymentFilter, setPaymentFilter, workspaceTypes, clearFilters, onNewBookingClick
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  const showClear = paymentFilter !== "ALL" || workspaceFilter !== "ALL" || startDateFilter || endDateFilter;
  const activeCount = [
    paymentFilter !== "ALL",
    workspaceFilter !== "ALL",
    !!startDateFilter,
    !!endDateFilter,
  ].filter(Boolean).length;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const inputBase = "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15 transition-all appearance-none";
  const labelBase = "block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5";

  return (
    <div className="flex items-center gap-3 mb-6 w-full">

      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 stroke-[1.75] pointer-events-none" />
        <input
          type="text"
          placeholder="Search by customer name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter dropdown trigger */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            filterOpen || activeCount > 0
              ? "bg-teal-50 border-teal-300 text-teal-600"
              : "bg-white border-neutral-200 text-neutral-600 hover:border-teal-200 hover:bg-teal-50/40"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[1.75]" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-150 ${filterOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown panel */}
        {filterOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-2xl shadow-lg z-30 overflow-hidden">

            {/* Dropdown header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-700">Filter Bookings</span>
              {showClear && (
                <button
                  onClick={() => { clearFilters(); setFilterOpen(false); }}
                  className="flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            <div className="p-4 space-y-4">

              {/* Date range */}
              <div>
                <label className={labelBase}>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Date Range</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
                {(startDateFilter || endDateFilter) && (
                  <button
                    onClick={() => { setStartDateFilter(""); setEndDateFilter(""); }}
                    className="text-[11px] text-neutral-400 hover:text-red-400 mt-1.5 transition-colors"
                  >
                    Clear dates
                  </button>
                )}
              </div>

              {/* Workspace */}
              <div>
                <label className={labelBase}>Workspace Type</label>
                <select
                  value={workspaceFilter}
                  onChange={(e) => setWorkspaceFilter(e.target.value)}
                  className={`${inputBase} cursor-pointer ${workspaceFilter !== "ALL" ? "border-teal-400 text-teal-600 bg-teal-50/40" : ""}`}
                >
                  <option value="ALL">All Workspaces</option>
                  {workspaceTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* Payment */}
              <div>
                <label className={labelBase}>Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {["ALL", "TRANSFER", "POS"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentFilter(method)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        paymentFilter === method
                          ? "bg-teal-500 border-teal-500 text-white"
                          : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-teal-300 hover:text-teal-600"
                      }`}
                    >
                      {method === "ALL" ? "All" : method}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Apply */}
            <div className="px-4 pb-4">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Booking */}
      <button
        onClick={onNewBookingClick}
        className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shadow-sm shadow-teal-200 flex-shrink-0"
      >
        <Plus className="w-4 h-4 stroke-[2]" />
        New Booking
      </button>

    </div>
  );
}