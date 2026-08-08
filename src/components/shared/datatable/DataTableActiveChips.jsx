import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";

export function DataTableActiveChips({ filterConfig = [], onClearAll }) {
  if (!filterConfig || filterConfig.length === 0) return null;

  // Flatten options from checkbox-group
  const activeChips = [];

  filterConfig.forEach((filter) => {
    if (filter.type === "select" && filter.value) {
      activeChips.push({
        id: filter.id,
        label: filter.label,
        displayValue: filter.getDisplayValue
          ? filter.getDisplayValue(filter.value)
          : (() => {
              const matched = filter.options?.find(
                (o) => (typeof o === "object" ? o.value : o) === filter.value,
              );
              const lbl = matched
                ? typeof matched === "object"
                  ? matched.label
                  : matched
                : filter.value;
              return String(lbl || "").replace(/_/g, " ").replace(/-/g, " ");
            })(),
        onClear: () => filter.onChange(""),
      });
    }

    if (filter.type === "checkbox-group") {
      filter.groups.forEach((group) => {
        group.options.forEach((opt) => {
          if (
            opt.value === true ||
            (typeof opt.value === "string" && opt.value !== "")
          ) {
            activeChips.push({
              id: opt.id,
              label: group.label || filter.label,
              displayValue: opt.getDisplayValue
                ? opt.getDisplayValue(opt.value)
                : opt.label,
              onClear: () => opt.onChange(undefined),
            });
          }
        });
      });
    }

    if (filter.type === "dateRange" && filter.value) {
      activeChips.push({
        id: filter.id,
        label: filter.label,
        displayValue: filter.value.preset === "custom" 
          ? `${new Date(filter.value.from).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} to ${new Date(filter.value.to).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
          : filter.value.preset === "last7" ? "Last 7 Days"
          : filter.value.preset === "last30" ? "Last 30 Days"
          : filter.value.preset === "last90" ? "Last 90 Days"
          : filter.value.preset === "lastYear" ? "Last 12 Months"
          : filter.value.preset === "allTime" ? "All Time"
          : String(filter.value.preset || "").replace(/_/g, " "),
        onClear: () => filter.onChange(null),
      });
    }
  });

  if (activeChips.length === 0) return null;

  return (
    <>
      {activeChips.map((chip, idx) => (
        <Badge
          key={chip.id || idx}
          variant="outline"
          className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
        >
          <span className="text-[10px] font-bold uppercase opacity-50">
            {chip.label}:
          </span>
          <span className="capitalize text-[11px] font-semibold">
            {chip.displayValue}
          </span>
          <button
            onClick={chip.onClear}
            className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
          >
            <IconX size={10} />
          </button>
        </Badge>
      ))}
      {onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 uppercase tracking-tight px-2 rounded-lg"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      )}
    </>
  );
}
