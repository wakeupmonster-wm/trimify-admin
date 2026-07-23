import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const SubscriptionDashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 3xl:gap-6 py-5 px-6 w-full max-w-full mx-auto font-jakarta bg-slate-50 min-h-screen">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-4">
        <div className="space-y-2">
          {/* Title */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div>
              <Skeleton className="h-7 w-52 md:w-64" />
              <Skeleton className="h-4 w-40 md:w-56 mt-1.5" />
            </div>
          </div>
        </div>
        {/* Date Picker */}
        <Skeleton className="h-10 w-full sm:w-[240px] rounded-lg" />
      </div>

      {/* KPI Cards Skeleton (6 items: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="border border-slate-300/60 bg-white rounded-2xl shadow-sm p-6 min-h-[110px]"
          >
            <div className="flex items-start gap-4">
              {/* Circular Icon badge skeleton */}
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-3.5 w-24" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Milestone Program Skeleton */}
      <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm mb-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-48" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3.5 w-56 mt-2" />
          </div>
        </div>
      </Card>

      {/* Rows of Double Charts */}
      <div className="space-y-6">
        {/* Row 1: Revenue Trend & Platform Mix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Skeleton */}
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[440px] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4.5 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
            <div className="flex-1 flex items-end gap-4 px-4 pt-6 pb-2">
              {[50, 80, 45, 90, 60, 75, 40].map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                >
                  <Skeleton
                    className="w-full rounded-t-lg"
                    style={{ height: `${h}%` }}
                  />
                  <Skeleton className="h-3 w-10 mt-1" />
                </div>
              ))}
            </div>
          </Card>

          {/* Platform Mix Skeleton */}
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[440px] p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="flex-1 py-6 space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Row 2: Subscriber Growth & Plan Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscriber Growth Skeleton */}
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[440px] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4.5 w-36" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
            <div className="flex-1 flex items-end gap-6 px-4 pt-6 pb-2">
              {[40, 70, 55, 85, 60].map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex items-end justify-center gap-1.5 h-full"
                >
                  <Skeleton
                    className="w-4 rounded-t-lg bg-indigo-200/50"
                    style={{ height: `${h}%` }}
                  />
                  <Skeleton
                    className="w-4 rounded-t-lg bg-rose-200/50"
                    style={{ height: `${h * 0.4}%` }}
                  />
                  <Skeleton
                    className="w-4 rounded-t-lg bg-emerald-200/50"
                    style={{ height: `${h * 0.7}%` }}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Plan Distribution Skeleton */}
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[440px] p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center py-6">
              {/* Circular Pie Chart Skeleton */}
              <div className="relative flex items-center justify-center h-48 w-48 rounded-full border-[16px] border-slate-100 animate-pulse">
                <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-app-primary2 border-r-app-primary2 rotate-45" />
                <div className="space-y-1.5 text-center">
                  <Skeleton className="h-6 w-16 mx-auto" />
                  <Skeleton className="h-3.5 w-12 mx-auto" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3: Top Selling Products & Last 24 Hours Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products Skeleton */}
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[440px] p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex-1 py-4 space-y-3.5 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm"
                >
                  <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="text-right space-y-1.5">
                    <Skeleton className="h-3.5 w-12 ml-auto" />
                    <Skeleton className="h-3 w-8 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Last 24 Hours Activity Skeleton */}
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[440px] p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-44" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center py-6">
              {/* Radial or Pie representation */}
              <div className="relative flex items-center justify-center h-44 w-44 rounded-full border-[12px] border-slate-100 animate-pulse">
                <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-indigo-300/30 border-l-emerald-300/30 -rotate-90" />
                <div className="space-y-1 text-center">
                  <Skeleton className="h-5 w-14 mx-auto" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
