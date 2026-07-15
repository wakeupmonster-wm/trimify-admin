import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DashboardHead from "./dashboard.head";
import { MdFitnessCenter } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCompactNumber, cn } from "@/lib/utils";
import { Crown, Dumbbell, MapPin } from "lucide-react";

const LIST_HEIGHT = "h-[280px] sm:h-[300px]";

// Fixed categorical order, cycled by rank position — never reassigned per re-render,
// so a given rank always reads the same color.
const RANK_STYLES = [
  { badge: "bg-brand-aqua/15 text-brand-aqua", bar: "bg-brand-aqua" },
  { badge: "bg-indigo-100 text-indigo-600", bar: "bg-indigo-500" },
  { badge: "bg-rose-100 text-rose-600", bar: "bg-rose-500" },
  { badge: "bg-amber-100 text-amber-600", bar: "bg-amber-500" },
  { badge: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-500" },
];

export function ContentPerformance({ data }) {
  const popularPrograms = data?.popularPrograms || [];
  const popularFitzones = data?.popularFitzones || [];

  const renderList = (items, valueKey, label) => {
    if (items.length === 0) {
      return (
        <div className={`flex items-center justify-center ${LIST_HEIGHT} text-slate-400 text-xs font-medium border-2 border-dashed border-slate-100 rounded-xl`}>
          No data available
        </div>
      );
    }

    const sorted = [...items].sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0));
    const maxVal = sorted[0]?.[valueKey] || 1;
    const top = sorted[0];

    return (
      <div className="flex flex-col gap-3.5">
        {/* Spotlight — the current #1 performer for this tab */}
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-brand-aqua to-[#2FA9AF] p-3.5 shadow-sm shadow-brand-aqua/25">
          <div className="h-9 w-9 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-white/75 uppercase tracking-wider">Top Performer</p>
            <p className="text-sm font-black text-white truncate">{top.title}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-black text-white leading-none">{formatCompactNumber(top[valueKey] || 0)}</p>
            <p className="text-[10px] font-semibold text-white/75 mt-0.5">{label}</p>
          </div>
        </div>

        <div className={`grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2.5 content-start ${LIST_HEIGHT} overflow-y-auto pr-2 -mr-2`}>
          {sorted.map((item, idx) => {
            const val = item[valueKey] || 0;
            const percentage = Math.max((val / maxVal) * 100, 4);
            const style = RANK_STYLES[idx % RANK_STYLES.length];
            return (
              <div
                key={item.id || idx}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span
                  className={cn(
                    "h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[11px] font-black",
                    style.badge
                  )}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-xs font-semibold text-slate-700 truncate">{item.title}</span>
                    <span className="text-xs font-bold text-slate-900 shrink-0 whitespace-nowrap">
                      {formatCompactNumber(val)}{" "}
                      <span className="font-medium text-slate-400 text-[10px]">{label}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", style.bar)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-xl border border-slate-200 hover:border-brand-aqua/50 transition-all duration-300 shadow-sm hover:shadow-md py-4 sm:py-5 bg-white overflow-hidden flex flex-col h-full gap-0">
      <CardHeader className="flex flex-col px-0 tracking-tight shrink-0">
        <div className="w-full flex items-center justify-between gap-2 pb-4 px-4 sm:px-5 border-b border-slate-200">
          <DashboardHead
            title="Content Performance"
            subtitle="Top performing fitness programs and zones"
            Icon={MdFitnessCenter}
            iconColor="text-brand-aqua"
            iconBg="bg-brand-aqua/10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-4 sm:px-5 pt-4 pb-2">
        <Tabs defaultValue="programs" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100/80 p-1 rounded-lg">
            <TabsTrigger
              value="programs"
              className="gap-1.5 text-[11px] font-bold rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brand-aqua"
            >
              <Dumbbell className="h-3.5 w-3.5" />
              Popular Programs
            </TabsTrigger>
            <TabsTrigger
              value="fitzones"
              className="gap-1.5 text-[11px] font-bold rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brand-aqua"
            >
              <MapPin className="h-3.5 w-3.5" />
              Popular Fitzones
            </TabsTrigger>
          </TabsList>
          <TabsContent value="programs" className="flex-1 mt-0">
            {renderList(popularPrograms, "enrollments", "enrolled")}
          </TabsContent>
          <TabsContent value="fitzones" className="flex-1 mt-0">
            {renderList(popularFitzones, "attendees", "attending")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
