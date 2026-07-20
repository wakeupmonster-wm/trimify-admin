import React from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfileSkeleton = () => {
  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </Header>
        
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-4 flex-1 w-full">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
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
    </Container>
  );
};

export default UserProfileSkeleton;
