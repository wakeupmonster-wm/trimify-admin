import React from "react";
import { Input } from "@/components/ui/input";
import { IconSearch, IconX } from "@tabler/icons-react";

export function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
  searchPlaceholder = "Search...",
  rowCount,
  itemName = "items",
  children, // For filters and custom actions
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`w-full flex flex-col md:flex-row items-center justify-between gap-4 py-1 ${children ? "" : "mb-2"}`}
      >
        {/* 1. LEFT SIDE: Search Input (Expanded) */}
        <div className="relative flex-1 min-w-0 w-full md:max-w-full">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-10 pr-10 bg-white border-slate-300/60 h-9 3xl:h-10 placeholder:text-slate-400 placeholder:font-normal shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-app-primary2 rounded-md w-full transition-all outline-none"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter?.(e.target.value)}
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center justify-center rounded-full p-1 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <IconX className="h-3.5 w-3.5 text-slate-500" />
            </button>
          )}
        </div>

        {/* 2. RIGHT SIDE CONTAINER: Filters & Count */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 shrink-0 w-full md:w-auto">
          {children}

          <div className="pl-2 pr-1 md:border-l border-slate-300/60 ml-1.5 flex items-center gap-1.5 shrink-0">
            <span className="text-xs 3xl:text-sm font-bold text-app-primary2">
              {rowCount ?? 0}
            </span>
            <span className="text-xs 3xl:text-sm text-slate-400 font-medium">
              {itemName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
