import React from "react";
import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

const UserProfileSkeleton = ({ onBack }) => {
  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        {/* Navigation Bar Skeleton */}
        <header className="flex md:items-center justify-between gap-4 pt-2">
          <div className="flex flex-row items-center gap-3 min-w-0">
            {onBack ? (
              <button
                onClick={onBack}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm transition-all text-slate-600 hover:bg-slate-50 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-1.5 gap-y-0 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <Skeleton className="h-6 sm:h-7 w-32 sm:w-40 rounded-md" />
                <span className="text-muted-foreground/30 font-normal text-xl md:text-2xl hidden sm:inline">
                  /
                </span>
              </div>
              <Skeleton className="h-5 sm:h-6 w-32 rounded-md sm:mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {/* Hero Header Skeleton */}
          <div className="mb-2 sm:mb-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-row items-center w-full gap-4">
              <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shrink-0" />
              <div className="flex flex-col items-start text-left flex-1 min-w-0 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-6 w-44 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t border-slate-100 lg:border-t-0">
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>

          {/* Tabs Bar Skeleton */}
          <div className="relative w-full overflow-hidden mb-2">
            <div className="hidden lg:flex items-center justify-between gap-2 p-1 bg-white rounded-lg w-full border border-slate-200 h-12 shadow-sm">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-9 flex-1 rounded-md" />
              ))}
            </div>
            <div className="lg:hidden flex gap-2 overflow-x-auto p-1 bg-white rounded-lg border border-slate-200">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-md" />
              ))}
            </div>
          </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 pb-8 sm:pb-12 min-w-0">
          <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
            {/* PersonalInfoCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* GoalsNutritionCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            </div>

            {/* EngagementCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 space-y-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* RecentActivityTimelineCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative space-y-2">
                    <div className="absolute -left-[25px] top-0 w-3 h-3 rounded-full bg-slate-200" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-4 sm:gap-6 min-w-0">
            {/* ContactCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SubscriptionCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            {/* SecurityCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* RecentLoginsCard Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0 mt-1" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
};

export default UserProfileSkeleton;
