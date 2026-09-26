import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6 px-3 md:px-6 py-6 mb-8">
      {/* 8 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[105px] rounded-2xl bg-slate-200/70 border border-slate-200/80"
          />
        ))}
      </div>

      {/* Trends Section Skeleton */}
      <div className="space-y-5 pt-3">
        <div className="flex flex-col items-start gap-1">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-3 w-48 rounded-md" />
        </div>

        {/* Composition Donut Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="h-[360px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
          <Skeleton className="h-[360px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
        </div>

        {/* Trend Area/Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-3">
          <Skeleton className="h-[360px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
          <Skeleton className="h-[360px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
        </div>
      </div>

      {/* Platform Activity Section Skeleton */}
      <div className="space-y-5 pt-3">
        <div className="flex flex-col items-start gap-1">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3 w-56 rounded-md" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="h-[360px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
          <Skeleton className="h-[360px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="h-[380px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
          <Skeleton className="h-[380px] rounded-2xl bg-slate-200/70 border border-slate-200/80" />
        </div>
      </div>
    </div>
  );
}
