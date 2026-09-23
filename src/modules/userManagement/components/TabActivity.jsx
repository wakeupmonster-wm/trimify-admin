import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity,
  Footprints,
  Droplets,
  Utensils,
  Weight,
  History,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, EmptyState } from "./UserProfileShared";
import { activityMeta, formatWeightValue } from "./activity.utils";
import { getUserActivityLogsAPI } from "../services/user.services";
import { DataTablePagination } from "@/components/shared/datatable/DataTablePagination";

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

const PERIODS = [
  { key: "1d", label: "1 Day" },
  { key: "3d", label: "3 Day" },
  { key: "90d", label: "Last 90 Days" },
  { key: "all", label: "Full History" },
];

// Survives tab unmounts while the user profile stays open, so toggling
// All/Water (or leaving and returning to Activity) does not flash a spinner.
const activityResponseCache = new Map();

export function TabActivity({ data }) {
  const { as, maxSteps, fmtDate, user } = data;
  const userId = user?.id || user?.user_id;

  const [filter, setFilter] = useState("all");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(as || {});
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivityLogs = useCallback(
    async (currentPage, currentLimit, currentFilter) => {
      if (!userId) return;
      const cacheKey = `${userId}:${currentPage}:${currentLimit}:${currentFilter || "all"}:${period}`;
      const cachedResponse = activityResponseCache.get(cacheKey);

      if (cachedResponse) {
        setActivities(cachedResponse.activities);
        setSummary(cachedResponse.summary);
        setTotalRows(cachedResponse.totalRows);
        setTotalPages(cachedResponse.totalPages);
        return;
      }

      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: currentLimit,
        };
        if (currentFilter && currentFilter !== "all") {
          params.type = currentFilter;
        }
        params.period = period;
        const res = await getUserActivityLogsAPI(userId, params);
        if (res?.success && res.data) {
          setActivities(res.data.activities || []);
          if (res.data.summary) {
            setSummary(res.data.summary);
          }
          if (res.data.pagination) {
            const nextTotalRows = res.data.pagination.total || 0;
            const nextTotalPages =
              res.data.pagination.last_page ||
                res.data.pagination.totalPage ||
                1;
            const cachedData = {
              activities: res.data.activities || [],
              summary: res.data.summary || as || {},
              totalRows: nextTotalRows,
              totalPages: nextTotalPages,
            };
            activityResponseCache.set(cacheKey, cachedData);
            setTotalRows(nextTotalRows);
            setTotalPages(nextTotalPages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch activity logs:", err);
      } finally {
        setLoading(false);
      }
    },
    [as, period, userId],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchActivityLogs(page, pageSize, filter);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchActivityLogs, page, pageSize, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePeriodChange = (nextPeriod) => {
    setPeriod(nextPeriod);
    setPage(1);
  };

  const activeFilterMeta =
    FILTERS.find((f) => f.key === filter) || FILTERS[0];

  const table = useMemo(
    () => ({
      getPageCount: () => totalPages,
      getState: () => ({
        pagination: {
          pageIndex: Math.max(0, page - 1),
          pageSize: pageSize,
        },
      }),
      setPageSize: (size) => {
        setPageSize(size);
        setPage(1);
      },
      previousPage: () => setPage((p) => Math.max(1, p - 1)),
      nextPage: () => setPage((p) => Math.min(totalPages, p + 1)),
      getCanPreviousPage: () => page > 1,
      getCanNextPage: () => page < totalPages,
      setPageIndex: (index) => setPage(index + 1),
    }),
    [page, pageSize, totalPages],
  );

  const activeSummary = summary || as || {};

  return (
    <>
      {/* Activity Section Header with Period Tabs */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
          Activity
        </h3>

        {/* Period Filter Tabs */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200/80">
          {PERIODS.map(({ key, label }) => {
            const isActive = period === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePeriodChange(key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-app-primary2 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      {/* KPI Top Cards */}
      <div className="mb-3.5 grid grid-cols-2 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          {
            key: "Steps",
            l: "Steps Logged",
            d: activeSummary.steps || {},
            icon: Footprints,
            tone: "emerald",
          },
          {
            key: "Water",
            l: "Water Consumed",
            d: activeSummary.water || {},
            icon: Droplets,
            tone: "blue",
          },
          {
            key: "Food",
            l: "Meals Logged",
            d: activeSummary.food || {},
            icon: Utensils,
            tone: "amber",
          },
          {
            key: "Weight",
            l: "Weight Entries",
            d: activeSummary.weight || {},
            icon: Weight,
            tone: "purple",
          },
        ].map((c) => {
          const type = TILE_TYPE[c.key];
          const isActive = filter === type;
          const isWater = c.key === "Water";

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
          const ringTones = {
            blue: "ring-app-primary2",
            purple: "ring-purple-500",
            emerald: "ring-emerald-500",
            amber: "ring-amber-500",
          };
          const borderActive = {
            blue: "border-app-primary2",
            purple: "border-purple-500",
            emerald: "border-emerald-500",
            amber: "border-amber-500",
          };

          const displayValue = c.key === "Steps"
            ? c.d.total_steps || 0
            : isWater
            ? `${c.d.total_liters ?? (c.d.total_ml ? (c.d.total_ml / 1000).toFixed(1) : 0)} L`
            : c.d.total_entries || 0;

          return (
            <button
              key={c.l}
              type="button"
              onClick={() => handleFilterChange(isActive ? "all" : type)}
              className={cn(
                "flex flex-col items-center justify-center px-6 py-4 rounded-2xl border border-slate-300/80 bg-white border-b-4 shadow-sm transition-all duration-300",
                borderTones[c.tone] || borderTones.blue,
                isActive
                  ? `ring-[0.2px] ring-offset-0 shadow-md -translate-y-0.5 border-b-4 ${ringTones[c.tone]} ${borderActive[c.tone]}`
                  : `hover:-translate-y-0.5 hover:shadow-md hover:border-slate-400`,
              )}
            >
              <div
                className={cn(
                  "text-2xl md:text-3xl font-black mb-1 transition-transform duration-300",
                  textTones[c.tone] || textTones.blue,
                )}
              >
                {displayValue}
              </div>
              <p className="text-xs md:text-[13px] font-bold text-slate-600 text-center tracking-tight">
                {c.l}
              </p>
              <p className="mt-0.5 text-[10.5px] font-semibold text-slate-400 text-center">
                {c.d.total_entries || 0} {(c.d.total_entries || 0) === 1 ? "log" : "logs"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Activity Log History Card */}
      <Card
        title="Activity Log History"
        subtitle="Steps, water, food & weight entries, newest first"
        icon={History}
        right={
          <span className="inline-flex items-center ml-auto sm:ml-0 w-max border border-slate-200 bg-slate-100/50 rounded-xl text-muted-foreground px-3 py-1 font-bold text-[10px] shadow-sm">
            {totalRows > 0
              ? `${totalRows} ${filter === "all" ? "Total Logs" : activeFilterMeta.label + " Logs"}`
              : "0 Logs"}
          </span>
        }
      >
        {/* Filter Pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => handleFilterChange(f.key)}
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

        {/* Content Area */}
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-app-primary2" />
            <p className="text-xs font-medium">Loading activity logs...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="flex flex-col">
            {activities.map((a, i) => {
              const { icon: Icon, className, label } = activityMeta(a.type);

              let displayTitle = a.title || "";
              if (a.type === "water_log") {
                if (a.water_ml !== undefined && a.water_ml !== null) {
                  displayTitle = `${a.water_ml} ml of water logged`;
                } else {
                  displayTitle = displayTitle
                    .replace(/glass\(es\)/i, "ml")
                    .replace(/glasses/i, "ml");
                }
              } else if (a.type === "weight_log") {
                const defaultUnit = user?.weight_unit || "kg";
                displayTitle = displayTitle.replace(
                  /Weight logged:\s*([\d.]+)\s*(\w+)?/i,
                  (_, weightNum, unit) =>
                    `Weight logged: ${formatWeightValue(weightNum)} ${unit || defaultUnit}`.trim(),
                );
              }

              const stepsVal =
                a.steps ||
                (a.type === "step_log"
                  ? parseInt(
                      ((a.title || "").match(/\d+/) || ["0"])[0],
                      10,
                    )
                  : 0);

              return (
                <div
                  key={a.id || `${a.type}-${i}`}
                  className="flex items-center gap-3 py-2.5 last:pb-0"
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
                      {displayTitle}
                    </div>
                    <div className="text-[10.5px] font-medium text-slate-400">
                      {label} · {fmtDate ? fmtDate(a.created_at) : a.created_at}
                    </div>
                  </div>
                  {a.type === "step_log" && (
                    <div className="hidden w-24 shrink-0 sm:block">
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-app-primary2"
                          style={{
                            width: `${maxSteps ? Math.min(100, Math.round((stepsVal / maxSteps) * 100)) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalRows > 0 && (
              <div className="mt-4 -mx-5 -mb-5">
                <DataTablePagination
                  table={table}
                  rowCount={totalRows}
                  itemName="Logs"
                />
              </div>
            )}
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
