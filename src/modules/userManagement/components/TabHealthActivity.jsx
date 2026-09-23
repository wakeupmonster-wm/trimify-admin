import React from "react";
import { TabHealth } from "./TabHealth";
import { TabActivity } from "./TabActivity";

/**
 * Merged "Health & Activity" tab.
 *
 * Layout:
 *   Section 1 — Health (static panels: Body Measurements + Medical & Fitness Profile)
 *   Divider
 *   Section 2 — Activity (date-filter, 4 stat chips, log list)
 *
 * The date filter only affects the Activity section.
 * Health panels are completely independent and never re-render from filter changes.
 */
export function TabHealthActivity({ data }) {
  return (
    <div className="flex flex-col gap-0">
      {/* ─── Section 1 — Health ─── */}
      <TabHealth data={data} />

      {/* ─── Divider ─── */}
      <div className="my-6 border-t border-slate-200" />

      {/* ─── Section 2 — Activity ─── */}
      <TabActivity data={data} />
    </div>
  );
}
