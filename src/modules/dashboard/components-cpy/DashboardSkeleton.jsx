import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 3xl:gap-6 py-5 px-4 lg:px-6 w-full max-w-full mx-auto">
      {/* Top Header Skeleton */}
      <div className="flex sm:items-center justify-between gap-4 w-full">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 md:w-64" />
          <Skeleton className="h-4 w-32 md:w-40" />
        </div>
        <Skeleton className="h-10 w-32 md:w-48 rounded-lg" />
      </div>

      {/* Today At A Glance Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card
            key={i}
            className="border border-slate-300/60 bg-white rounded-2xl shadow-sm"
          >
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ecosystem Alerts Skeleton */}
      <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-24">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </CardContent>
      </Card>

      {/* Key Metrics Section */}
      <div className="flex flex-col gap-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 3xl:gap-6 w-full items-stretch">
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[420px]">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="h-[320px]">
              <Skeleton className="h-full w-full rounded-xl" />
            </CardContent>
          </Card>
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[420px]">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="h-[320px]">
              <Skeleton className="h-full w-full rounded-xl" />
            </CardContent>
          </Card>
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[420px]">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="h-[320px]">
              <Skeleton className="h-full w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytical Row 3: Bento Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 3xl:gap-6 w-full items-stretch">
        {/* Left Column: Revenue Breakdown */}
        <div className="lg:col-span-4">
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[560px]">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent className="h-[460px]">
              <Skeleton className="h-full w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & Heatmap */}
        <div className="lg:col-span-8 flex flex-col gap-4 3xl:gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 3xl:gap-6">
            <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[225px]">
              <CardHeader className="pb-4">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="h-[100px]">
                <Skeleton className="h-full w-full rounded-xl" />
              </CardContent>
            </Card>
            <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[225px]">
              <CardHeader className="pb-4">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="h-[100px]">
                <Skeleton className="h-full w-full rounded-xl" />
              </CardContent>
            </Card>
          </div>
          <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[320px]">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="h-[220px]">
              <Skeleton className="h-full w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Visitors + User Type Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 3xl:gap-6">
        <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[480px]">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="h-[380px]">
            <Skeleton className="h-full w-full rounded-xl" />
          </CardContent>
        </Card>
        <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm h-[480px]">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="h-[380px]">
            <Skeleton className="h-full w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>

      {/* Table Skeleton */}
      <Card className="border border-slate-300/60 bg-white rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
