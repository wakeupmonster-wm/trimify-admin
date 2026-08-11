import React, { useMemo, useState } from "react";
import {
  Activity,
  Footprints,
  Droplets,
  Utensils,
  Weight,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, EmptyState } from "./UserProfileShared";
import { activityMeta } from "./activity.utils";

const FILTERS = [
  { key: "all", label: "All", tile: null },
  { key: "step_log", label: "Steps", tile: "Steps" },
  { key: "water_log", label: "Water", tile: "Water" },
  { key: "food_log", label: "Food", tile: "Food" },
  { key: "weight_log", label: "Weight", tile: "Weight" },
];

const TILE_TYPE = {
  Steps: "step_log",
  Water: "water_log",
  Food: "food_log",
  Weight: "weight_log",
};

export function TabActivity({ data }) {
  const { as, logActivities, maxSteps, fmtDate } = data;
  const [filter, setFilter] = useState("all");

  const filteredActivities = useMemo(
    () =>
      filter === "all"
        ? logActivities
        : logActivities.filter((a) => a.type === filter),
    [logActivities, filter],
  );

  const activeFilterMeta = FILTERS.find((f) => f.key === filter);

  return (
    <>
      <div className="mb-3.5 grid grid-cols-2 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          { l: "Steps", d: as.steps || {}, icon: Footprints, tone: "emerald" },
          { l: "Water", d: as.water || {}, icon: Droplets, tone: "blue" },
          { l: "Food", d: as.food || {}, icon: Utensils, tone: "amber" },
          { l: "Weight", d: as.weight || {}, icon: Weight, tone: "purple" },
        ].map((c) => {
          const type = TILE_TYPE[c.l];
          const isActive = filter === type;

          const borderTones = {
            blue: "border-b-app-primary2",
            purple: "border-b-purple-500",
            emerald: "border-b-emerald-500",
            amber: "border-b-amber-500",
          };
          const textTones = {
            blue: "text-app-primary2",
            purple: "text-purple-500",
            emerald: "text-emerald-500",
            amber: "text-amber-500",
          };

          return (
            <button
              key={c.l}
              type="button"
              onClick={() => setFilter(isActive ? "all" : type)}
              className={cn(
                "flex flex-col items-center justify-center px-6 py-4 rounded-2xl border border-slate-300/80 bg-white border-b-4 shadow-sm transition-all duration-300",
                borderTones[c.tone] || borderTones.blue,
                isActive
                  ? "ring-1 ring-offset-0 ring-app-primary2 shadow-md -translate-y-0.5"
                  : "hover:-translate-y-0.5 hover:shadow-md",
              )}
            >
              <div
                className={cn(
                  "text-2xl md:text-3xl font-black mb-1 transition-transform duration-300",
                  textTones[c.tone] || textTones.blue,
                )}
              >
                {c.d.total_entries || 0}
              </div>
              <p className="text-xs md:text-[13px] font-bold text-slate-600 text-center tracking-tight">
                {c.l}
              </p>
              {/* <p className="mt-1.5 text-[10px] font-medium text-slate-400 text-center">
                {c.d.last_logged_at
                  ? `Last: ${fmtDate(c.d.last_logged_at)}`
                  : "No entries yet"}
              </p> */}
            </button>
          );
        })}
      </div>

      <Card
        title="Activity Log History"
        subtitle="Steps, water, food & weight entries, newest first"
        icon={History}
        right={
          <span className="inline-flex items-center ml-auto sm:ml-0 w-max border border-slate-200 bg-slate-100/50 rounded-xl text-muted-foreground px-3 py-1 font-bold text-[10px] shadow-sm">
            {filteredActivities.length} Active Categories
          </span>
        }
      >
        <div className="mb-4 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3 py-1 text-[10.5px] font-semibold transition-colors",
                filter === f.key
                  ? "border-app-primary2 bg-app-primary2/10 text-app-primary2"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredActivities.length > 0 ? (
          <div className="flex flex-col">
            {filteredActivities.map((a, i) => {
              const { icon: Icon, className, label } = activityMeta(a.type);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-slate-50 py-2.5 last:border-b-0 last:pb-0"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      className,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-slate-900">
                      {a.title}
                    </div>
                    <div className="text-[10.5px] font-medium text-slate-400">
                      {label} · {fmtDate(a.created_at)}
                    </div>
                  </div>
                  {a.type === "step_log" && (
                    <div className="hidden w-24 shrink-0 sm:block">
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-app-primary2"
                          style={{
                            width: `${maxSteps ? ((a.steps / maxSteps) * 100).toFixed(0) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={filter === "all" ? Activity : activityMeta(filter).icon}
            title={
              filter === "all"
                ? "No Activity Logs"
                : `No ${activeFilterMeta.label} Logs`
            }
            subtitle={
              filter === "all"
                ? "User hasn't logged any activity yet."
                : `User hasn't logged any ${activeFilterMeta.label.toLowerCase()} entries yet.`
            }
          />
        )}
      </Card>
    </>
  );
}
