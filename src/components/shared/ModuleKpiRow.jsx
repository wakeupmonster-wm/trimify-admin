import React from "react";
import KpiCard from "@/modules/dashboard/components/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared KPI strip for module list pages (Users, Fitzone, Program, ...).
 * Single source of truth for the grid so every module tab lines up the
 * same way instead of each page picking its own breakpoints.
 *
 * `items[].value` should come from the backend's `kpis` object on the
 * list response — it must reflect the full dataset, not just the
 * current (paginated) page. While `kpis` hasn't loaded yet, pass
 * `loading` to render placeholders instead of a wrong/zero count.
 */
const ModuleKpiRow = ({ items, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Skeleton key={item.label} className="h-[92px] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <KpiCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value ?? "—"}
          description={item.description}
          tone={item.tone}
          onClick={item.onClick}
          isSelected={item.isSelected}
        />
      ))}
    </div>
  );
};

export default ModuleKpiRow;
