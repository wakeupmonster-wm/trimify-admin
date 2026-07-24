import React from "react";
import { Activity } from "lucide-react";
import { Card, EmptyState } from "./UserProfileView";

export function TabActivity({ data }) {
  const { as, weight, parsedActivities, maxSteps, fmtDate } = data;

  return (
    <>
      <>
        <div className="mb-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { l: "Steps", d: as.steps || {} },
            { l: "Water", d: as.water || {} },
            { l: "Food", d: as.food || {} },
            { l: "Weight", d: as.weight || {} },
          ].map((c) => (
            <div
              key={c.l}
              className="rounded-xl border border-slate-200 px-5 py-4 bg-white"
            >
              <div className="text-xs font-medium text-slate-500">
                {c.l}
              </div>
              <div className="mt-1 text-base font-bold tabular-nums text-slate-900">
                {c.d.total_entries || 0}{" "}
                <span className="text-[11px] font-medium text-slate-500">
                  entries
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {c.d.last_logged_at
                  ? `Last: ${fmtDate(c.d.last_logged_at)}`
                  : "No entries yet"}
              </div>
            </div>
          ))}
        </div>

        <Card
          title="Step Log History"
          subtitle="Most recent entries, newest first"
          right={
            <span className="text-[10.5px] font-semibold text-slate-500">
              {parsedActivities.length} records
            </span>
          }
        >
          {parsedActivities.length > 0 ? (
            parsedActivities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className="w-[100px] shrink-0 text-[11px] font-medium text-slate-600">
                  {fmtDate(a.created_at)}
                </div>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#007fc0]"
                    style={{
                      width: `${maxSteps ? ((a.steps / maxSteps) * 100).toFixed(0) : 0}%`,
                    }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right text-[11px] font-semibold tabular-nums text-slate-900">
                  {a.steps.toLocaleString()} steps
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={Activity} title="No Step Logs" subtitle="User hasn't logged any steps." />
          )}
        </Card>
      </>
    </>
  );
}
